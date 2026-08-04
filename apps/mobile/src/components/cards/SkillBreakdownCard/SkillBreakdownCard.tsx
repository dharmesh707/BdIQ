import Card from "../../ui/Card/Card";
import SkillBar from "../../ui/SkillBar/SkillBar";

interface Props {
  smash: number;
  drive: number;
  drop: number;
  netPlay: number;
  footwork: number;
}

export default function SkillBreakdownCard({
  smash,
  drive,
  drop,
  netPlay,
  footwork,
}: Props) {
  return (
    <Card>
      <SkillBar skill="Smash" value={smash} />

      <SkillBar skill="Drive" value={drive} />

      <SkillBar skill="Drop" value={drop} />

      <SkillBar skill="Net Play" value={netPlay} />

      <SkillBar skill="Footwork" value={footwork} />
    </Card>
  );
}
