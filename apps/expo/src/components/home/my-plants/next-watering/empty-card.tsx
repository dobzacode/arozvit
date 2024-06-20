import { Text, View } from "react-native";
import moment from "moment";
import { MotiView } from "moti/build";

export default function EmptyCard({ date }: { date: string }) {
  return (
    <MotiView
      from={{ translateX: -100, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      transition={{ damping: 300 }}
      exit={{ translateX: -100, opacity: 0 }}
      needsOffscreenAlphaCompositing
    >
      <View className="card-neutral h-[76] w-full items-center justify-center">
        <Text className="body text-surface-fg dark:text-surface">
          Aucun arrosage de prévu pour{" "}
          {moment().format("YYYY-MM-DD") === date
            ? "aujourd'hui !"
            : `cette date !`}
        </Text>
      </View>
    </MotiView>
  );
}
