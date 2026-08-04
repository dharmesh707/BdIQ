import Screen from "../../components/layout/Screen";
import Header from "../../components/layout/Header";
import SectionTitle from "../../components/ui/SectionTitle/SectionTitle";

import LoadingCard from "../../components/cards/LoadingCard/LoadingCard";
import ErrorCard from "../../components/cards/ErrorCard/ErrorCard";

import ProfileHeaderCard from "../../components/cards/ProfileHeaderCard/ProfileHeaderCard";
import PlayerLevelCard from "../../components/cards/PlayerLevelCard/PlayerLevelCard";
import ProfileStatisticCard from "../../components/cards/ProfileStatisticCard/ProfileStatisticCard";
import SettingsCard from "../../components/cards/SettingsCard/SettingsCard";
import AboutCard from "../../components/cards/AboutCard/AboutCard";

import { useProfile } from "../../hooks/useProfile";

export default function ProfileScreen() {
  const { data, isPending, error } = useProfile();

  if (isPending) {
    return (
      <Screen>
        <Header title="Profile" subtitle="Loading your player profile..." />
        <LoadingCard />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen>
        <Header title="Profile" subtitle="Unable to load profile." />
        <ErrorCard message="Failed to load profile." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Profile" subtitle="Your badminton journey." />

      <ProfileHeaderCard name={data.playerName} level={data.level} />

      <SectionTitle title="Player Rating" />

      <PlayerLevelCard
        score={data.averageScore}
        consistency={data.consistency}
      />

      <SectionTitle title="Statistics" />

      <ProfileStatisticCard title="Analyses" value={data.totalAnalyses} />

      <ProfileStatisticCard title="Training" value={data.completedTraining} />

      <ProfileStatisticCard title="Current Streak" value={data.streak} />

      <ProfileStatisticCard title="Favourite Shot" value={data.favoriteShot} />

      <SectionTitle title="Settings" />

      <SettingsCard />

      <SectionTitle title="About BadmintonIQ" />

      <AboutCard />
    </Screen>
  );
}
