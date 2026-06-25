"""
Analysis service — business logic layer.
The endpoint calls this. This calls the ML scoring functions.
In production the ML functions are the TFLite pipeline.
For now they mirror the POC logic exactly.
"""

AXELSON_FH_SMASH = {
    'right_elbow_angle': 165, 'right_shoulder_height': 20,
    'right_knee_angle': 155,  'hip_shoulder_separation': 45,
}

TEMPLATES = {
    "viktor_axelson": AXELSON_FH_SMASH,
}

def score_shot(joint_angles: dict, template_id: str) -> tuple[float, list[dict]]:
    template = TEMPLATES.get(template_id, AXELSON_FH_SMASH)
    checks = [
        dict(key='right_elbow', u=joint_angles.get('right_elbow', 0),
             i=template['right_elbow_angle'], w=0.30, md=40,
             lm='Elbow too bent at contact — extend more fully ({u:.0f} vs {i:.0f} deg)',
             hm='Elbow slightly over-extended ({u:.0f} vs {i:.0f} deg)'),
        dict(key='right_wrist_elevation', u=joint_angles.get('right_wrist_elevation', 0),
             i=template['right_shoulder_height'], w=0.25, md=25,
             lm='Contact point too low — hit above shoulder height ({u:.0f} vs {i:.0f})',
             hm='Good contact height'),
        dict(key='right_knee', u=joint_angles.get('right_knee', 180),
             i=template['right_knee_angle'], w=0.20, md=30,
             lm='Too much knee bend ({u:.0f} vs {i:.0f} deg)',
             hm='Legs too straight — add a small knee bend ({u:.0f} vs {i:.0f} deg)'),
        dict(key='hip_shoulder_sep', u=joint_angles.get('hip_shoulder_sep', 0),
             i=template['hip_shoulder_separation'], w=0.25, md=35,
             lm='Not enough trunk rotation — power comes from the hips ({u:.0f} vs {i:.0f} deg)',
             hm='Good rotation'),
    ]
    penalty = 0.0; corrections = []
    for c in checks:
        dev = abs(c['u'] - c['i'])
        penalty += min(dev / c['md'], 1.0) * c['w'] * 100
        if dev > c['md'] * 0.20:
            msg = (c['lm'] if c['u'] < c['i'] else c['hm']).format(u=c['u'], i=c['i'])
            corrections.append({
                'joint': c['key'],
                'deviation_degrees': round(c['u'] - c['i'], 1),
                'user_value': round(c['u'], 1),
                'template_value': c['i'],
                'description': msg,
                'severity': 'HIGH' if dev > c['md'] * 0.55 else 'MEDIUM',
            })
    corrections.sort(key=lambda x: abs(x['deviation_degrees']), reverse=True)
    return round(max(0.0, 100.0 - penalty), 1), corrections[:3]