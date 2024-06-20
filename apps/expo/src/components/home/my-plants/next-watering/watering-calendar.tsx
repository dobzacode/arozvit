import { useColorScheme, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
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

  maxDate,
  setPickedDate,
  marked,
}: {
  pickedDate: string;
  setPickedDate: (date: string) => void;

  maxDate?: string;
  marked?: Date[];
}) {
  const colorScheme = useColorScheme();

  const markedDates: MarkedDates = Object.fromEntries(
    marked?.map((markedDate) => [
      moment(markedDate).format("YYYY-MM-DD"),
      {
        marked: true,
        dotColor: "blue",
        disableTouchEvent: false,
        disabled: false,
        inactive: false,
      },
    ]) ?? [],
  );

  if (pickedDate) {
    markedDates[moment(pickedDate).format("YYYY-MM-DD")] = {
      selected: true,
      disableTouchEvent: false,
      disabled: false,
    };
  }

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      needsOffscreenAlphaCompositing={colorScheme === "light" ? true : false}
    >
      <View className="card-neutral px-sm pb-sm">
        <Calendar
          disabledByDefault={maxDate ? false : true}
          disableAllTouchEventsForDisabledDays={maxDate ? false : true}
          key={colorScheme}
          className=" rounded-sm "
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
          markedDates={markedDates}
          onDayPress={(day) => {
            console.log(day.dateString);
            setPickedDate(day.dateString);
          }}
        ></Calendar>
      </View>
    </MotiView>
  );
}
