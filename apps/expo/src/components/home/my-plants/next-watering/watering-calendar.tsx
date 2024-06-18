import { useColorScheme, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import { MotiView } from "moti/build";

//eslint-disable-next-line
LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui",
};
//eslint-disable-next-line
LocaleConfig.defaultLocale = "fr";

export default function WateringCalendar({
  pickedDate,
  minDate,
  maxDate,
  setPickedDate,
}: {
  pickedDate: string;
  setPickedDate: (date: string) => void;
  minDate?: string;
  maxDate?: string;
}) {
  const colorScheme = useColorScheme();
  console.log(maxDate);

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      needsOffscreenAlphaCompositing={colorScheme === "light" ? true : false}
    >
      <View className="card-neutral px-sm pb-sm">
        <Calendar
          key={colorScheme}
          className=" rounded-sm "
          minDate={minDate}
          maxDate={maxDate}
          theme={{
            textDisabledColor:
              colorScheme === "dark"
                ? "hsla(98, 05%, 50%, 0.4)"
                : "hsla(98, 05%, 50%, 0.4)",
            weekVerticalMargin: 4,
            calendarBackground:
              colorScheme === "dark" ? "hsl(98, 20%, 5%)" : "hsl(98, 20%, 98%)",
            arrowColor: colorScheme === "dark" ? "white" : "black",
            dayTextColor:
              colorScheme === "dark"
                ? "hsl(98, 20%, 98%)"
                : "hsl(98, 20%, 02%)",
            monthTextColor:
              colorScheme === "dark"
                ? "hsl(98, 20%, 98%)"
                : "hsl(98, 20%, 02%)",
            todayTextColor: "hsl(98, 20%, 50%)",
            textInactiveColor: "green",
            selectedDayBackgroundColor: "hsl(98, 20%, 50%)",
            indicatorColor: "hsl(98, 20%, 50%)",
            textDayHeaderFontFamily: "mustica-pro",
            textDayFontFamily: "mustica-pro",
            textMonthFontFamily: "mustica-pro",
          }}
          current={pickedDate}
          markedDates={
            pickedDate
              ? {
                  [moment(pickedDate).format("YYYY-MM-DD")]: { selected: true },
                }
              : {}
          }
          onDayPress={(day) => {
            console.log(day.dateString);
            setPickedDate(day.dateString);
          }}
        ></Calendar>
      </View>
    </MotiView>
  );
}
