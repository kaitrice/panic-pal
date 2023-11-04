import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import Swiper from 'react-native-swiper';

const windowWidth = Dimensions.get ('window').width;

const Calendar = () => {
  const swiper = useRef ();
  const [value, setValue] = useState (new Date ());
  const [week, setWeek] = useState (0);

  const weeks = React.useMemo (
    () => {
      const start = moment ().add (week, 'weeks').startOf ('week');

      return [-1, 0, 1].map (adj => {
        return Array.from ({length: 7}).map ((_, index) => {
          const date = moment (start).add (adj, 'week').add (index, 'day');

          return {
            weekday: date.format ('ddd'),
            date: date.toDate (),
          };
        });
      });
    },
    [week]
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={ind => {
              if (ind === 1) {
                return;
              }
              setTimeout (() => {
                const newIndex = ind - 1;
                const newWeek = week + newIndex;
                setWeek (newWeek);
                setValue (moment (value).add (newIndex, 'week').toDate ());
                swiper.current.scrollTo (1, false);
              }, 100);
            }}
          >
            {weeks.map ((dates, index) => (
              <View style={[styles.itemRow]} key={index}>
                {dates.map ((item, dateIndex) => {
                  const isActive =
                    value.toDateString () === item.date.toDateString ();
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => setValue (item.date)}
                    >
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: '#80B9E2',
                            borderColor: '#80B9E2',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && {color: '#fff'},
                          ]}
                        >
                          {item.weekday}
                        </Text>
                        <Text
                          style={[styles.itemDate, isActive && {color: '#fff'}]}
                        >
                          {item.date.getDate ()}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        <View style={{flex: 1, paddingHorizontal: 10}}>
          <View>
            <Text> journal here !!!</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    width: windowWidth,
  },
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRow: {
    width: windowWidth,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e3e3e3',
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: '500',
    color: '#737373',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
});
export default Calendar;