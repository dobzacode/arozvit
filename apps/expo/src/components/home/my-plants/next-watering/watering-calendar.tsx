import { useColorScheme, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";

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
  setPickedDate,
}: {
  pickedDate: string;
  setPickedDate: (date: string) => void;
}) {
  const colorScheme = useColorScheme();

  console.log(pickedDate);

  return (
    <View className="card-neutral">
      <Calendar
        key={colorScheme}
        className=" rounded-sm"
        minDate={moment().tz("Europe/Paris").format()}
        style={{
          borderRadius: 8,
          borderColor: "hsl(98, 20%, 10%)",
          borderWidth: colorScheme === "dark" ? 1 : 0,
        }}
        theme={{
          calendarBackground:
            colorScheme === "dark" ? "hsl(98, 20%, 10%)" : "hsl(98, 20%, 98%)",
          arrowColor: colorScheme === "dark" ? "white" : "black",
          dayTextColor:
            colorScheme === "dark" ? "hsl(98, 20%, 98%)" : "hsl(98, 20%, 02%)",
          monthTextColor:
            colorScheme === "dark" ? "hsl(98, 20%, 98%)" : "hsl(98, 20%, 02%)",
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
            ? { [moment(pickedDate).format("YYYY-MM-DD")]: { selected: true } }
            : {}
        }
        onDayPress={(day) => {
          setPickedDate(day.dateString);
        }}
      ></Calendar>
    </View>
  );
}
