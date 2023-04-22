import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
  Keyboard,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
  RefreshControl,
} from 'react-native';
import AppColors from './common/AppColor';
import Modal from 'react-native-modal';

// import CalendarList from 'react-native-calendars/src/calendar';
// import Agenda from 'react-native-calendars/src/agenda';
import {Agenda, Calendar, CalendarList} from 'react-native-calendars';

import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

import {RadioButton} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import Checkbox from './Checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RepeatDays from './RepeatDays';
import ApiCalling from './network/ApiCalling';
import Util from './utils/Util';
import Colors from './common/Colors';
import ProgressDialog from './components/ProgressDialog';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-paper';
import TabNavigation from './TabNavigation';
import {FAB} from 'react-native-paper';
import AppStyle from './common/AppStyle';
import CloseButton from './CloseButton';
import ToolBar from './components/ToolBar';
import CalendarStrip from 'react-native-calendar-strip';
import {Images} from './assets';

const datesWhitelist = [moment()];

const schoolNamelist = [
  {label: 'Grade 1', value: '1'},
  {label: 'Grade 3', value: '2'},
  {label: 'Grade 4', value: '3'},
];
const timeDay = [
  {time: 'all day', data: []},
  {time: '1 pm', data: []},
  {time: '2 pm', data: []},
  {time: '3 pm', data: []},
  {time: '4 pm', data: []},
  {time: '5 pm', data: []},
  {time: '6 pm', data: []},
  {time: '7 pm', data: []},
  {time: '8 pm', data: []},
  {time: '9 pm', data: []},
  {time: '10 pm', data: []},
  {time: '11 pm', data: []},
  {time: '12 pm', data: []},
  {time: '1 am', data: []},
  {time: '2 am', data: []},
  {time: '3 am', data: []},
  {time: '4 am', data: []},
  {time: '5 am', data: []},
  {time: '6 am', data: []},
  {time: '7 am', data: []},
  {time: '8 am', data: []},
  {time: '9 am', data: []},
  {time: '10 am', data: []},
  {time: '11 am', data: []},
  {time: '12 am', data: []},
];
const eventData = [
  {label: 'Exam', value: 'exam'},
  {label: 'Event', value: 'event'},
  {label: 'Holiday', value: 'Holiday'},
];
const gradDataaaaa = [
  {id: 41, label: 'demo'},
  {id: 39, label: 'first grade'},
  {id: 29, label: 'Grade 1'},
  {id: 3, label: 'Grade 12'},
  {id: 35, label: 'Grade 13'},
  {id: 4, label: 'Grade 2'},
  {id: 38, label: 'Grade 2'},
  {id: 5, label: 'grade 3'},
  {id: 30, label: 'Grade 3'},
  {id: 31, label: 'Grade 6'},
  {id: 32, label: 'Grade 7'},
  {id: 33, label: 'Grade 8'},
  {id: 34, label: 'Grade 9'},
  {id: 8, label: 'Grade A'},
  {id: 6, label: 'grade B'},
  {id: 2, label: 'grade C'},
  {id: 40, label: 'grade test'},
  {id: 11, label: 'Test Grade'},
];
//custom dropdown

const CalendarEvent = ({navigation}) => {
  const [currentMonth, setCurrentMonth] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [startDat, setStartDate] = useState(
    moment().startOf('month').format('YYYY/MM/DD'),
  );
  const [endDat, setEndDate] = useState(
    moment().endOf('month').format('YYYY/MM/DD'),
  );
  const [heading, setHeading] = useState(0);
  const [calOpen, setCalOpen] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const [data, setData] = useState(null);
  const [mark, setMark] = useState({});
  const [gradList, setGradlist] = useState(null);
  const [classRoomList, setClassRoomlist] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [classId, setClassId] = useState(null);
  // const[eventType,setEventType]=useState(null);
  const [gradId, setGradId] = useState(null);
  const [markedEvent, setMarkedEvent] = useState([]);
  const today = moment().format('YYYY-MM-DD');
  const [day, setDay] = useState(new Date().toDateString());
  const [daySelect, setDaySelect] = useState('');
  const [month, setMonth] = useState('March');
  const [year, setYear] = useState(2023);
  const [selectedDayEvents, setSelectedDayEvents] = useState();
  const [selectedDay, setSelectedDay] = useState(timeDay);
  const [showModal, setshowModal] = useState(false);
  const [showModalDetails, setshowModalDetails] = useState(false);

  const [showEventDate, setshowEventDate] = useState(false);
  const [showEventEndDate, setshowEventEndDate] = useState(false);
  const [checked, setChecked] = useState('first');
  const [openAccordion, setOpenAccordion] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [classSelectShow, setClassSelectShow] = useState(false);
  const [classSelect, setClassSelect] = useState('');
  const [openEventAccordion, setOpenEventAccordion] = useState(false);
  const [selectGrade, setSelectGrade] = useState('');
  const [eventDate, setEventDate] = useState(null);
  const [eventLastDate, setEventLastDate] = useState(null);
  const [selectEvent, setSelectEvent] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDes, setEventDes] = useState('');
  const [eventType, setEventType] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);

  const [isChecked, setIsChecked] = useState(true);
  const [isrepeat, setIsRepeat] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [selectStartTime, setSelectStartTime] = useState(null);
  const [selectEndTime, setSelectEndTime] = useState(null);
  const [activeSunDay, setActiveSunDay] = useState(false);
  const [activeMonDay, setActiveMonDay] = useState(false);
  const [activeTueDay, setActiveTueDay] = useState(false);
  const [activeWedDay, setActiveWedDay] = useState(false);
  const [activeThuDay, setActiveThuDay] = useState(false);
  const [activeFriDay, setActiveFriDay] = useState(false);
  const [activeSatDay, setActiveSatDay] = useState(false);
  const [showRepeatDay, setShowRepeatDay] = useState(false);
  const [showfullDayEvent, setShowfulldayEvent] = useState(true);
  const [selectMonth, setSelectMonth] = useState('');
  const [selectMonthAndDay, setSelectMonthAndDay] = useState('');
  const [schoolId, setSchoolId] = useState(null);
  const [agendaCal, setAgendaCal] = useState(1);
  const [agendaData, setAgendaData] = useState(null);
  const [isStaff, setisStaff] = useState(false);

  // const [showFullDayDropdown, setShowFullDayDropdown] = useState(true);
  const [remove, setRemove] = useState();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getData();
    allListApi();
    console.log('satringg update:=-', startDat);
  }, [startDat, endDat, selectedDay, currentMonth,agendaCal, selectMonth]);
  const getData = async () => {
    try {
      Util.getUser()
        .then(async data => {
          //console.log(data);
          setisStaff(data.is_staff);
          if (data.is_staff) {
            var params = {
              start_date: startDat,
              end_date: endDat,
              grade_id: 0,
              room_id: 0,
            };
            //console.log('parmas', params);
            setLoading(true);
            await ApiCalling.apiCallBodyDataPost('event/list', params).then(
              async res => {
                //console.log('Response::', res.data);
                if (res.data.code == 1002) {
                  Util.showMsg(res.data.message);
                  setLoading(false);
                } else {
                  forAgendaCal(res.data);
                  setData(res.data);
                  var da = [];
                  await res.data.map(d => {
                    da.push(moment(d.dd).format('YYYY-MM-DD'));
                  });
                  //console.log(da);
                  setMarkedEvent(da);
                  const eventList = res.data.filter(item => {
                    return (
                      moment(item.dd).format('YYYY-MM-DD') ==
                      moment().format('YYYY-MM-DD')
                    );
                  });
                  //console.log('eventList===', eventList);
                  setSelectedDayEvents(eventList);
                  setMarkedDate(da, new Date().toDateString());

                  setLoading(false);
                }

                // let markedDay = {};

                // da.map(item => {

                //   (markedDay[moment(day).format('YYYY-MM-DD')] = {
                //     selected: true,
                //     selectedColor: Colors.primary,
                //   }),
                //     (markedDay[item] = {
                //       selected: false,
                //       dotColor: '#999',
                //       marked: true,
                //     });
                // });
                // setMark(markedDay);

                // //console.log('markedd===');
              },
            );
          } else {
            var params = {
              start_date: startDat,
              end_date: endDat,
            };
            //console.log('parmas', params);
            Util.getSelectedChild().then(async da => {
              setLoading(true);
              await ApiCalling.apiCallBodyDataPost(
                'event/student-events/' + da.id,
                params,
              ).then(async res => {
                setData(res.data);
                if(agendaCal!=1){
                  forAgendaCal(res.data);
                }
                setMarkedParentDate(res.data,new Date().toDateString());
                console.log('====', res.data);
                const eventList = res.data.filter(item => {
                  return (
                    moment(item.dd).format('YYYY-MM-DD') ==
                    moment().format('YYYY-MM-DD')
                  );
                });
                //console.log('eventList===', eventList);
                setSelectedDayEvents(eventList);

                setLoading(false);
              });
            });
          }
        })

        .catch(error => {
          console.log(error);
        });
    } catch (error) {}
  };
  const months = [
    {label: 'January', value: moment().month('January').format('YYYY-MM-DD')},
    {label: 'February', value: moment().month('February').format('YYYY-MM-DD')},
    {label: 'March', value: moment().month('March').format('YYYY-MM-DD')},
    {label: 'April', value: moment().month('April').format('YYYY-MM-DD')},
    {label: 'May', value: moment().month('May').format('YYYY-MM-DD')},
    {label: 'June', value: moment().month('Jun').format('YYYY-MM-DD')},
    {label: 'July', value: moment().month('July').format('YYYY-MM-DD')},
    {label: 'August', value: moment().month('August').format('YYYY-MM-DD')},
    {
      label: 'Septembre',
      value: moment().month('Septembre').format('YYYY-MM-DD'),
    },
    {label: 'October', value: moment().month('October').format('YYYY-MM-DD')},
    {label: 'November', value: moment().month('November').format('YYYY-MM-DD')},
    {label: 'December', value: moment().month('December').format('YYYY-MM-DD')},
  ];
  const MonthAndDay = [
    {label: 'Month', value: 1},
    {label: 'Day', value: 2},
  ];
  const EventTypeDropdown = ({isEventSelect, iseEventSelectSet}) => {
    const renderItem = item => {
      return (
        <View style={styles.dropdownItem}>
          <Text style={styles.dropdownText}>{item.label}</Text>;
          {item.isEventSelect === isEventSelect && ''}
          {/* {nameList.map(item => {
            
          })} */}
        </View>
      );
    };

    return (
      <>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={eventList}
          labelField="label"
          valueField="value"
          placeholder="Event Type"
          value={isEventSelect}
          onChange={item => {
            console.log(item.label);
            setEventType(item.label);
            iseEventSelectSet(item.value);
          }}
          renderItems={renderItem}
        />
      </>
    );
  };

  const editEvent = item => {
    console.log('Event:-', item);
    setHeading(1);
    setshowModal(true);
    setEventTitle(item.title);
    setEventDes(item.description);
    setEventDate(item.date);
    // setSelectStartTime(item.start_time);
    // setSelectEndTime(item.end_time);
    setIsChecked(item.isfullday);
    setActiveMonDay(item.monday);
    setActiveTueDay(item.tuesday);
    setActiveWedDay(item.wednesday);
    setActiveThuDay(item.thursday);
    setActiveFriDay(item.friday);
    setActiveSatDay(item.saturday);
    setActiveSunDay(item.sunday);
    setEventLastDate(item.repeat_ends_on);
    setIsRepeat(item.repeat);
    setClassId(item.classroom_id);
    setGradId(item.grade_id);
    setSchoolId(item.id);
  };

  const Item = ({title, des, allItem}) => (
    <View style={styles.item}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* <Icon
          color={allItem.EventType.color_code}
          name="circle-o"
          size={15}
          style={{}}
        /> */}
        {console.log(des)}
        <Image
          source={Images.circle}
          style={{
            tintColor: allItem.EventType.color_code,
            height: 12,
            width: 12,
          }}
        />
        <Text style={{marginLeft: 5, color: AppColors.grayColor}}>
          {allItem.isfullday
            ? 'Full Day Event'
            : moment(allItem.start_time, ['HH.mm']).format('hh:mm a') +
              '-' +
              moment(allItem.end_time, ['HH.mm']).format('hh:mm a')}
        </Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.des}>{des}</Text>
      <View
        style={{
          position: 'absolute',
          top: 15,
          right: 15,
        }}>
        {isStaff && (
          <TouchableOpacity onPress={() => editEvent(allItem)}>
            <MaterialCommunityIcons
              color={AppColors.accentBorder}
              name="dots-horizontal"
              size={22}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const MonthsDropdown = ({selectMonth, setSelectMonth}) => {
    return (
      <TouchableOpacity>
        <Dropdown
          style={{
            width: 150,
            padding: 4,
            marginVertical: 4,
            marginLeft: 10,
            // ...AppStyle.TextStyle.optionMenuTitle,
          }}
          placeholderStyle={{
            paddingHorizontal: 22,
            fontSize: 20,
            marginBottom: 4,
            ...AppStyle.TextStyle.titleExtraLarge,
          }}
          placeholder="Month"
          data={months}
          value={selectMonth}
          labelField="label"
          valueField="value"
          onChange={item => {
            setSelectedDayEvents([])
            console.log(item.value);
            onMonthGloballyChange(item.value);
            setCurrentMonth(item.value);
            setSelectMonth(item.value);
          }}
          renderLeftIcon={() => ''}
          // renderItem={renderItem}
        />
      </TouchableOpacity>
    );
  };
  const MonthsAndDayDropdown = ({selectMonthAndDay, setSelectMonthAndDay}) => {
    return (
      <TouchableOpacity>
        <Dropdown
          style={{
            width: 90,
            // padding: 4,
            // marginVertical: 4,
            marginLeft: 10,
            // ...AppStyle.TextStyle.optionMenuTitle,
          }}
          placeholderStyle={{
            ...AppStyle.TextStyle.titleNormal,
          }}
          placeholder="Month"
          data={MonthAndDay}
          value={selectMonthAndDay}
          labelField="label"
          valueField="value"
          onChange={item => {
            console.log(item.value);
            setAgendaCal(item.value);
            getData()
            setSelectMonthAndDay(item.value);
          }}
          renderLeftIcon={() => ''}
          // renderItem={renderItem}
        />
      </TouchableOpacity>
    );
  };

  const dayPressHandler = day => {
    console.log('day', day);

    setDay(day.dateString);
    setEventDate(day.dateString);
    // getData();
    if (isStaff) {
      setMarkedDate(markedEvent, day.dateString);
    } else {
      setMarkedParentDate(data,day.dateString);
      // console.log("marked date:=",mark);
      // if(mark){

      // }
    }
    // let markedDay = {};
    
    // markedDay[day.dateString] = {selected: true, selectedColor: Colors.primary};
    // let newList = Object.assign(mark, markedDay);
    // console.log('mark Date:=', newList);
    // setMark(newList);

    const eventList = data.filter(item => {
      return moment(item.dd).format('YYYY-MM-DD') == day.dateString;
    });
    console.log('eventList===', eventList);
    setSelectedDayEvents(eventList);
  };
  const dayTimePress = day => {
    var Timeday = timeDay;
    Timeday.filter(i => {
      i.data = [];
    });
    data.filter(item => {
      if (
        moment(item.dd).format('YYYY-MM-DD') == moment(day).format('YYYY-MM-DD')
      ) {
        Timeday.filter(i => {
          if (
            item.event.start_time == null &&
            item.event.end_time == null &&
            i.time == 'all day'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '01:00' &&
            item.event.start_time < '02:00' &&
            i.time == '1 am'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '02:00' &&
            item.event.start_time < '03:00' &&
            i.time == '2 am'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '03:00' &&
            item.event.start_time < '04:00' &&
            i.time == '3 am'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '04:00' &&
            item.event.start_time < '05:00' &&
            i.time == '4 am'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '05:00' &&
            item.event.start_time < '06:00' &&
            i.time == '5 am'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '06:00' &&
            item.event.start_time < '07:00' &&
            i.time == '6 am'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '07:00' &&
            item.event.start_time < '08:00' &&
            i.time == '7 am'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '08:00' &&
            item.event.start_time < '09:00' &&
            i.time == '8 am'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '09:00' &&
            item.event.start_time < '10:00' &&
            i.time == '9 am'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '10:00' &&
            item.event.start_time < '11:00' &&
            i.time == '10 am'
          ) {
            i.data.push(item.event);
          }
          ///ddd
          else if (
            item.event.start_time >= '11:00' &&
            item.event.start_time < '12:00' &&
            i.time == '11 am'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '12:00' &&
            item.event.start_time < '13:00' &&
            i.time == '12 am'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '13:00' &&
            item.event.start_time < '14:00' &&
            i.time == '1 pm'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '14:00' &&
            item.event.start_time < '15:00' &&
            i.time == '2 pm'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '15:00' &&
            item.event.start_time < '16:00' &&
            i.time == '3 pm'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '16:00' &&
            item.event.start_time < '17:00' &&
            i.time == '4 pm'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '17:00' &&
            item.event.start_time < '18:00' &&
            i.time == '5 pm'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '18:00' &&
            item.event.start_time < '19:00' &&
            i.time == '6 pm'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '19:00' &&
            item.event.start_time < '20:00' &&
            i.time == '7 pm'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '20:00' &&
            item.event.start_time < '21:00' &&
            i.time == '8 pm'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '21:00' &&
            item.event.start_time < '22:00' &&
            i.time == '9 pm'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '22:00' &&
            item.event.start_time < '23:00' &&
            i.time == '10 pm'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '23:00' &&
            item.event.start_time < '24:00' &&
            i.time == '11 pm'
          ) {
            i.data.push(item.event);
          } else if (
            item.event.start_time >= '24:00' &&
            item.event.start_time < '01:00' &&
            i.time == '12 pm'
          ) {
            i.data.push(item.event);
          }
        });
      }
    });

    // console.log('day Wise List===', Timeday);
    setSelectedDay(Timeday);
    getData();
    // console.log('date Wise List===', selectedDay);
  };
  const onMonthGloballyChange = async month => {
    console.log(month);
    const firstdate = moment(month).startOf('month').format('YYYY/MM/DD');
    const lastdate = moment(month).endOf('month').format('YYYY/MM/DD');
    // console.log('before update=', startDat);
    setStartDate(firstdate);
    setEndDate(lastdate);
    getData();
    // console.log('New Date:-', startDat);
  };
  const holidayradioHandler = () => {
    console.log('first');
    setChecked('first');
    setShowDropdown(false);
    setClassSelectShow(false);
  };
  const GraderadioHandler = () => {
    console.log('second');
    setChecked('second');
    setShowDropdown(true);
    setClassSelectShow(false);
    setClassId(null);
  };

  const ClassradioHandler = () => {
    console.log('third');
    setChecked('third');
    setShowDropdown(false);
    setClassSelectShow(true);
    setGradId(null);
  };

  const eventDetaileHandler = () => {
    setOpenEventAccordion(!openEventAccordion);
    setOpenAccordion(false);
  };
  const eventForHandler = () => {
    setOpenAccordion(!openAccordion);
    setOpenEventAccordion(false);
  };

  const eventTitleChange = e => {
    console.log(e.target.value);
  };

  const showStartTimePicker = time => {
    setStartTimePickerVisibility(true);
    console.log(time);
    setSelectStartTime(time);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const handleStartTimeConfirm = time => {
    console.log('A date has been picked: ', time);
    setStartTimePickerVisibility(true);
    setSelectStartTime(time);
    setStartTimePickerVisibility(false);
  };
  const handleEventLastConfirm = date => {
    console.log(date);
    setEventLastDate(date);
    setshowEventEndDate(false);
  };
  const handleEventConfirm = date => {
    console.log(date);
    setEventDate(date);
    setshowEventDate(false);
  };
  var markDate = {
    // [markedEvent]: {selected: true, selectedColor: 'pink'},
    // '2023-03-18':{marked: true,dotColor: '#999'},
  };
  //End Time Picker
  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };
  const hideEndTimePicker = time => {
    setEndTimePickerVisibility(false);
  };
  const handleEndTimeConfirm = time => {
    console.log('A date has been picked: ', time);
    setSelectEndTime(time);
    setEndTimePickerVisibility(false);
  };


  const forAgendaCal = async data => {
    var groups = data?.reduce((groups, game) => {
      // console.log('List=', game.sent_on);

      const date = game.dd?.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(game);
      return groups;
    }, {});
    var groupArrays = Object.keys(groups).map(date => {
      //console.log(date);
      return {
        date,
        event: groups[date],
      };
    });
    var x = [];
    var y = [];
    groupArrays.filter(dd => {
      var len = dd.event.length;

      dd.event.filter(d => {
        if (x.length <= 3) {
          //console.log('===', len);
          if (len == 1) {
            //console.log('Length ==1');

            x = [
              {
                color: d.event.EventType.color_code,
              },
            ];
          } else if (len == 2) {
            //console.log('Length ==2');

            x = [
              {
                color: d.event.EventType.color_code,
              },
              {
                color: d.event.EventType.color_code,
              },
            ];
          } else if (len > 2) {
            //console.log('Length ==3');
            x = [
              {
                color: d.event.EventType.color_code,
              },
              {
                color: d.event.EventType.color_code,
              },
              {
                color: d.event.EventType.color_code,
              },
            ];
          }
        } else {
          x = [];
        }

        y.push({date: dd.date, dots: x});
      });
    });
    // data.map(i => {
    //   x.push({date: i.dd, dots: [{color: i.event.EventType.color_code}]});
    // });
    console.log('Agenda Data==', y);
    setAgendaData(y);
    // console.log("New Data=",newItems);
  };
  const setMarkedParentDate = async (data,datee) => {
    console.log("after Press:=",data+"====="+datee);
    var groups = data?.reduce((groups, game) => {
      // console.log('List=', game.sent_on);

      const date = game.dd?.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(game);
      return groups;
    }, {});

    var groupArrays = Object.keys(groups).map(date => {
      //console.log(date);
      return {
        date,
        event: groups[date],
      };
    });
    //console.log('Group array', groupArrays);
    let markedDay = {};
    var x = [];

    groupArrays.filter(dd => {
      var len = dd.event.length;

      dd.event.filter(d => {
        if (x.length <= 3) {
          //console.log('===', len);
          if (len == 1) {
            //console.log('Length ==1');

            x = [
              {
                key: d.event.EventType.type,
                color: d.event.EventType.color_code,
                // selectedDotColor: d.EventType.color_code,
              },
            ];
          } else if (len == 2) {
            //console.log('Length ==2');

            x = [
              {
                key: d.event.EventType.type,
                color: d.event.EventType.color_code,
                // selectedDotColor: d.EventType.color_code,
              },
              {
                key: d.event.EventType.type,
                color: d.event.EventType.color_code,
                // selectedDotColor: d.EventType.color_code,
              },
            ];
          } else if (len > 2) {
            //console.log('Length ==3');
            x = [
              {
                key: d.event.EventType.type,
                color: d.event.EventType.color_code,
                // selectedDotColor: d.EventType.color_code,
              },
              {
                key: d.event.EventType.type,
                color: d.event.EventType.color_code,
                // selectedDotColor: d.EventType.color_code,
              },
              {
                key: d.event.EventType.type,
                color: d.event.EventType.color_code,
                // selectedDotColor: d.EventType.color_code,
              },
            ];
          }
        } else {
          x = [];
        }

        (markedDay[moment(datee).format('YYYY-MM-DD')] = {
          selected: true,
          selectedColor: Colors.primary,
        }),
          (markedDay[moment(d.dd).format('YYYY-MM-DD')] = {
            selected: false,
            selectedColor: Colors.primary,
            dots: x,
          });
      });
    });

    console.log('final dots==', markedDay);
    setMark(markedDay);

    // console.log('markedd===', markedDay);
  };
  const setMarkedDate = async (da, date) => {
    let markedDay = {};

    da.map(item => {
      (markedDay[moment(date).format('YYYY-MM-DD')] = {
        selected: true,
        selectedColor: Colors.primary,
      }),
        (markedDay[item] = {
          selected: false,
          dotColor: '#999',
          marked: true,
        });
    });
    setMark(markedDay);

    console.log('markedd===');
  };
  const allListApi = async () => {
    // gradlist api
    await ApiCalling.apiCallParamsGet('grade/list').then(async res => {
      // console.log('Response::', res.data);
      var gradList = [];
      await res.data.filter(e => gradList.push({label: e.title, value: e.id}));
      // console.log('graedDate:===', gradList);
      setGradlist(gradList);
    });
    // classroom aPI
    await ApiCalling.apiCallParamsGet('classroom/list').then(async res => {
      var classList = [];
      await res.data.filter(e => classList.push({label: e.name, value: e.id}));
      // console.log('gradList::', classList);
      setClassRoomlist(classList);
    });

    //Event APi
    await ApiCalling.apiCallParamsGet('event/types').then(async res => {
      var eventTypeList = [];
      await res.data.filter(e =>
        eventTypeList.push({label: e.type, value: e.id}),
      );
      // console.log('event Type::', eventTypeList);
      setEventList(eventTypeList);
    });
  };
  const onMonthChange = async month => {
    setSelectedDayEvents([])
    console.log('Month change==', month);
    const firstdate = moment(month.dateString)
      .startOf('month')
      .format('YYYY/MM/DD');
    const lastdate = moment(month.dateString)
      .endOf('month')
      .format('YYYY/MM/DD');
    // console.log('before update=', startDat);

    setStartDate(firstdate);
    setEndDate(lastdate);
    setSelectMonth(moment(month.dateString).format('YYYY-MM-DD'));
    // getData();
    // console.log('New Date:-', startDat);
  };
  const handleRepeat = () => {
    setIsRepeat(!isrepeat);
    setShowRepeatDay(!showRepeatDay);
  };
  const clearValue = () => {
    setHeading(0);
    setClassId(null);
    setGradId(null);
    setEventDate(null);
    setEventLastDate(null);
    setSelectEvent('');
    setEventTitle('');
    setEventDes('');
    setEventType(null);
    setIsChecked(true);
    setIsRepeat(false);
    setSelectStartTime(null);
    setSelectEndTime(null);
    setActiveSunDay(false);
    setActiveMonDay(false);
    setActiveTueDay(false);
    setActiveWedDay(false);
    setActiveThuDay(false);
    setActiveFriDay(false);
    setActiveSatDay(false);
    setShowRepeatDay(false);
    setShowfulldayEvent(true);
    setSchoolId(null);
    setOpenAccordion(false);
    setOpenEventAccordion(false);
  };

  const addEvent = async () => {
    console.log('addEvent');
    try {
      if (!Util.isValidData(eventDate)) {
        Util.showMsg('Event date is required');
        return;
      }
      if (!Util.isValidData(eventTitle)) {
        Util.showMsg('Title is required');
        return;
      }
      if (!Util.isValidData(selectEvent)) {
        Util.showMsg('Type is required');
        return;
      }
      if (isChecked === false && !Util.isValidData(selectStartTime)) {
        Util.showMsg('Start time of event required');
        return;
      }
      if (isChecked === false && !Util.isValidData(selectEndTime)) {
        Util.showMsg('End time of event required');
        return;
      }
      if (isrepeat === true && !Util.isValidData(eventLastDate)) {
        Util.showMsg('Please enter end date');
        return;
      }

      var params = {
        title: eventTitle,
        description: eventDes,
        date: eventDate != null ? moment(eventDate).format('YYYY-MM-DD') : '',
        event_type: eventType,
        isfullday: isChecked,
        start_time:
          selectStartTime != null
            ? moment(selectStartTime).format('HH:mm')
            : '',
        end_time:
          selectEndTime != null ? moment(selectEndTime).format('HH:mm') : '',
        repeat: isrepeat,
        monday: activeMonDay,
        tuesday: activeTueDay,
        wednesday: activeWedDay,
        thursday: activeThuDay,
        friday: activeFriDay,
        saturday: activeSatDay,
        sunday: activeSunDay,
        repeat_ends_on:
          eventLastDate != null
            ? moment(eventLastDate).format('YYYY-MM-DD')
            : '',
        grade_id: gradId,
        classroom_id: classId,
      };

      setLoading(true);
      ApiCalling.apiCallBodyDataPost('event/add', params).then(res => {
        console.log(res);
        console.log(res.data);
        setLoading(false);

        clearValue();
        Util.showMsg(res.data.message);
        setshowModal(false);
        getData();
      });
    } catch (error) {}
  };

  const updateEvent = async () => {
    try {
      if (!Util.isValidData(eventDate)) {
        Util.showMsg('Event date is required');
        return;
      }
      if (!Util.isValidData(eventTitle)) {
        Util.showMsg('Title is required');
        return;
      }
      if (!Util.isValidData(selectEvent)) {
        Util.showMsg('Type is required');
        return;
      }
      if (isChecked === false && !Util.isValidData(selectStartTime)) {
        Util.showMsg('Start time of event required');
        return;
      }
      if (isChecked === false && !Util.isValidData(selectEndTime)) {
        Util.showMsg('End time of event required');
        return;
      }
      if (isrepeat === true && !Util.isValidData(eventLastDate)) {
        Util.showMsg('Please enter end date');
        return;
      }
      var params = {
        id: schoolId,
        title: eventTitle,
        date: eventDate != null ? moment(eventDate).format('YYYY-MM-DD') : '',
        event_type: eventType,
        isfullday: isChecked,
        repeat: isrepeat,
        monday: activeMonDay,
        tuesday: activeTueDay,
        wednesday: activeWedDay,
        thursday: activeThuDay,
        friday: activeFriDay,
        saturday: activeSatDay,
        sunday: activeSunDay,
        repeat_ends_on:
          eventLastDate != null
            ? moment(eventLastDate).format('YYYY-MM-DD')
            : '',
      };
      console.log(params);
      setLoading(true);

      ApiCalling.apiCallBodyDataPost('event/update', params).then(res => {
        console.log(res);
        console.log(res.data);
        setLoading(false);

        clearValue();

        Util.showMsg(res.data.message);
        if (res.data.status == true) {
          setshowModal(false);
          getData();
        }
      });
    } catch (error) {}
  };
  const deleteEvent = async () => {
    try {
      Alert.alert('Delete Event', 'Are you sure you want to delete event?', [
        {
          text: 'No',
          onPress: () => console.log('Dismiss'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setLoading(true);
            ApiCalling.apiCallDelete('event/' + schoolId).then(res => {
              console.log(res.data);
              setLoading(false);
              Util.showMsg('Delete Event Successfully');
              setshowModal(false);
              getData();
            });
          },
        },
      ]);
    } catch (error) {
      Util.showMsg(error);
    }
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getData();
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      {ProgressDialog.CustomProgressBar(isLoading)}
      {/* <ToolBar
        toolBarTitle={'Calendar'}
        showSubTitle={false}
        showBackIcon={false}
        navigation={navigation}
        onHomeIconClick={() => {
          navigation.goBack(null);
        }}
      /> */}

      {/* <Calendar
        // ondate
        onDayPress={dayPressHandler}
        onMonthChange={month => {
          onMonthChange(month);
        }}
        hideExtraDays={true}
        markedDates={mark}
        onDayLongPress={day => {
          console.log('selected day', day);
        }}
        scrollEnabled={true}
        onRefresh={() => console.log('refreshing...')}
        style={{
          elevation: 2,
        }}
        theme={{
          arrowColor: AppColors.accent,
        }}
      /> */}

      <View
        style={{
          paddingVertical: 10,
          backgroundColor: AppColors.white,
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}>
        <View>
          <MonthsDropdown
            selectMonth={selectMonth}
            setSelectMonth={setSelectMonth}
          />
        </View>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.iconColor,
            position: 'relative',
            right: -20,
            borderRadius: 3,
          }}>
          <MonthsAndDayDropdown
            selectMonthAndDay={selectMonthAndDay}
            setSelectMonthAndDay={setSelectMonthAndDay}
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              setCurrentMonth(moment().format('YYYY-MM-DD')),
                setSelectMonth(moment().format('YYYY-MM-DD')),
                onMonthGloballyChange(moment());
            }}
            style={{position: 'relative', right: 15}}>
            <MaterialCommunityIcons
              name="calendar"
              color={Colors.iconColor}
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
      {agendaCal == 1 ? (
        <ScrollView contentContainerStyle={{flex: 1}}>
          {isStaff ? (
            <Calendar
              // ondate
              initialDate={currentMonth}
              // current={currentMonth}
              enableSwipeMonths={true}
              onDayPress={dayPressHandler}
              onMonthChange={month => {
                onMonthChange(month);
              }}
              // markingType={'multi-dot'}
              hideExtraDays={true}
              markedDates={mark}
              onDayLongPress={day => {
                // console.log('selected day', );
              }}
              scrollEnabled={true}
              onRefresh={() => console.log('refreshing...')}
              style={{
                elevation: 2,
              }}
              theme={{
                arrowColor: AppColors.accent,
              }}
            />
          ) : (
            <Calendar
              // ondate
              initialDate={currentMonth}
              // current={currentMonth}
              hideArrows
              // onPressArrowLeft={onMonthChangePressLeft}
              enableSwipeMonths={true}
              customHeaderTitle={() => <Text></Text>}
              onDayPress={dayPressHandler}
              onMonthChange={month => {
                onMonthChange(month);
              }}
              markingType={'multi-dot'}
              hideExtraDays={true}
              markedDates={mark}
              onDayLongPress={day => {
                // console.log('selected day', );
              }}
              scrollEnabled={true}
              onRefresh={() => console.log('refreshing...')}
              style={{
                elevation: 2,
              }}
              theme={{
                arrowColor: AppColors.accent,
              }}
            />
          )}
          <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
            <View
              style={{
                borderWidth: 0.3,
                height: 5,
                borderRadius: 13,
                backgroundColor: AppColors.lightGray,
                // borderStyle: 'solid',
                width: 30,
                alignSelf: 'center',
                borderColor: AppColors.lightGray,
                marginTop: 4,
              }}
            />
            <FlatList
              data={selectedDayEvents}
              contentContainerStyle={{paddingTop: 10, paddingBottom: 10}}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    setEventDetails(item), setshowModalDetails(true);
                  }}>
                  <Item
                    key={index}
                    title={item.event.title}
                    des={item.event.description}
                    icon={item.icon}
                    allItem={item.event}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: Colors.placeholderColor, fontSize: 20}}>
                    No Event on this date
                  </Text>
                </View>
              }
            />
            {/* <FAB
              icon="plus"
              color={AppColors.white}
              style={styles.fabAddButton}
              onPress={() => navigation.navigate('AddEvent')}
            /> */}
          </SafeAreaView>
        </ScrollView>
      ) : (
        <View>
          <CalendarStrip
            // datesWhitelist={datesWhitelist}
            selectedDate={currentMonth}
            markedDates={agendaData}
            style={{
              height: 80,
              borderRadius: 8,
              elevation: 5,
              paddingTop: 5,
              marginHorizontal: 10,
              paddingBottom: 10,
            }}
            scrollable={true}
            showMonth={false}
            calendarColor={Colors.white}
            calendarHeaderStyle={{color: Colors.primary}}
            dateNumberStyle={{color: Colors.primary}}
            dateNameStyle={{color: Colors.primary}}
            iconContainer={{flex: 0.1}}
            onDateSelected={dayTimePress}
          />

          <FlatList
            data={selectedDay}
            style={{}}
            contentContainerStyle={{
              paddingTop: 10,
              margin: 10,
              paddingBottom: 170,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  backgroundColor: AppColors.inputColor,
                  borderColor: AppColors.inputColor,
                  height: 0.3,
                }}
              />
            )}
            renderItem={({item, index}) => {
              // console.log('FlatList Data==', item);
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>
                  <Text style={{color: Colors.black, fontSize: 15}}>
                    {item?.time}
                  </Text>
                  <FlatList
                    data={item.data}
                    horizontal
                    renderItem={({item, index}) => {
                      // console.log('FlatList Data==', item);
                      return (
                        <View
                          style={{
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            paddingLeft: 10,
                            flex: 1,
                            marginLeft: 5,
                            borderRadius: 8,
                            backgroundColor: Colors.primary,
                          }}>
                          <Text style={{color: Colors.white, fontSize: 15}}>
                            {item?.title}
                          </Text>
                          <Text style={{color: Colors.white, fontSize: 12}}>
                            {item?.description}
                          </Text>
                        </View>
                      );
                    }}
                  />
                </View>
              );
            }}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: Colors.placeholderColor, fontSize: 20}}>
                  No Event on this date
                </Text>
              </View>
            }
            keyExtractor={item => item.time}
          />
        </View>
      )}

      <Modal
        isVisible={showModal}
        onBackdropPress={() => setshowModal(false)}
        onSwipeComplete={() => setshowModal(false)}
        swipeDirection="left"
        onBackButtonPress={() => setshowModal(false)}>
        <ScrollView>
          <View
            style={{
              margin: 20,
              backgroundColor: '#fff',
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 10,
              elevation: 3,
            }}>
            <Text
              style={{
                color: 'black',
                paddingVertical: 5,
                ...AppStyle.TextStyle.titleNormal,
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 4,
                textAlign: 'center',
                paddingVertical: 3,
              }}>
              {heading == 0 ? 'Add New Event' : 'Edit Event'}
            </Text>
            <TouchableOpacity
              onPress={() => setshowModal(false)}
              style={{position: 'absolute', top: 8, right: 8, padding: 5}}>
              <MaterialCommunityIcons name="close" size={25} />
            </TouchableOpacity>

            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: AppColors.borderColor,
                marginTop: 5,
              }}
            />

            <View
              style={{
                marginVertical: 10,
              }}>
              <View
                style={{
                  paddingVertical: 5,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  onPress={eventForHandler}>
                  <Text
                    style={{
                      color: AppColors.accent,
                      fontSize: 15,
                      ...AppStyle.TextStyle.descNormalPrimary,
                    }}>
                    Event For{' '}
                  </Text>
                  <View
                    style={{
                      borderRadius: 11,
                      backgroundColor: AppColors.accent,
                      width: 22,
                      height: 22,
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    {openAccordion ? (
                      <Icon
                        name="angle-up"
                        size={20}
                        style={{color: AppColors.white}}
                      />
                    ) : (
                      <Icon
                        name="angle-down"
                        size={20}
                        style={{color: AppColors.white}}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              {openAccordion ? (
                <>
                  <View style={styles.accordianSection} animationType="fade">
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <RadioButton
                        value="first"
                        status={checked === 'first' ? 'checked' : 'uncheked'}
                        onPress={holidayradioHandler}
                      />
                      <Text
                        style={{
                          color: '#000',
                          ...AppStyle.TextStyle.descNormal,
                        }}>
                        All (i.e. Public Holiday)
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <RadioButton
                        value="Second"
                        status={checked === 'second' ? 'checked' : 'uncheked'}
                        onPress={GraderadioHandler}
                      />
                      <Text
                        style={{
                          color: '#000',
                          ...AppStyle.TextStyle.descNormal,
                        }}>
                        for a Grade
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <RadioButton
                        value="third"
                        status={checked === 'third' ? 'checked' : 'uncheked'}
                        onPress={ClassradioHandler}
                      />
                      <Text style={{...AppStyle.TextStyle.descNormal}}>
                        for a ClassRoom{' '}
                      </Text>
                    </View>

                    {showDropdown ? (
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={gradList}
                        labelField="label"
                        valueField="value"
                        placeholder="Please Select Grade"
                        value={selectGrade}
                        onChange={item => {
                          console.log(item.value);
                          setGradId(item.value), setSelectGrade(item.value);
                          // setShowDropdown(!showDropdown);
                        }}
                        // renderItems={renderItem}
                      />
                    ) : (
                      ''
                    )}
                    {classSelectShow ? (
                      // <ClassDropdownComponent
                      //   isselected={classSelect}
                      //   isselectedSet={setClassSelect}
                      // />
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={{
                          height: 40,
                          fontSize: 15,
                          color: '#000',
                        }}
                        data={classRoomList}
                        labelField="label"
                        valueField="value"
                        placeholder="Please select Classroom"
                        value={classSelect}
                        onChange={item => {
                          console.log(item);
                          setClassId(item.value);
                          setClassSelect(item.value);
                        }}
                        // renderItems={renderItem}
                      />
                    ) : (
                      ''
                    )}
                  </View>
                </>
              ) : null}
            </View>

            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: AppColors.borderColor,
                marginVertical: 5,
              }}
            />

            <View style={{marginVertical: 10}}>
              <View
                style={{
                  paddingVertical: 5,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  onPress={eventDetaileHandler}>
                  <Text
                    style={{
                      color: AppColors.accent,
                      fontSize: 15,
                      ...AppStyle.TextStyle.descNormalPrimary,
                    }}>
                    Event Details{' '}
                  </Text>
                  <View
                    style={{
                      borderRadius: 100,
                      backgroundColor: AppColors.accent,
                      width: 22,
                      height: 22,
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    {openEventAccordion ? (
                      <Icon
                        name="angle-up"
                        size={20}
                        style={{color: AppColors.white}}
                      />
                    ) : (
                      <Icon
                        name="angle-down"
                        size={20}
                        style={{color: AppColors.white}}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              {openEventAccordion ? (
                <>
                  <View style={styles.accordianSection}>
                    <View
                      style={{
                        paddingVertical: 5,
                        paddingHorizontal: 5,
                      }}>
                      <Text
                        style={{
                          ...AppStyle.TextStyle.descNormal,
                        }}>
                        Date
                      </Text>
                      <TouchableOpacity
                        onPress={() => setshowEventDate(true)}
                        style={{...styles.timeSelectButton}}>
                        <Text
                          style={{
                            ...AppStyle.TextStyle.descNormal,
                          }}>
                          {eventDate != null &&
                            moment(eventDate).format('DD/MM/YYYY')}
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{
                          ...AppStyle.TextStyle.descNormal,
                        }}>
                        Title
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Your Title"
                        mode="outlined"
                        value={eventTitle}
                        placeholderTextColor="#495057"
                        onChangeText={text => {
                          setEventTitle(text);
                          eventTitleChange;
                        }}
                        inputMode="text"
                      />
                      <Text style={styles.textColor}>Description</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Description"
                        mode="outlined"
                        inputMode="text"
                        placeholderTextColor="#495057"
                        onChangeText={text => setEventDes(text)}
                      />
                      <Text
                        style={{
                          ...AppStyle.TextStyle.descNormal,
                        }}>
                        Event Type
                      </Text>
                      <EventTypeDropdown
                        isEventSelect={selectEvent}
                        iseEventSelectSet={setSelectEvent}
                      />

                      <View
                        style={{
                          marginTop: 10,
                        }}>
                        <Checkbox
                          onPress={() => setIsChecked(!isChecked)}
                          title="Full Day Event"
                          isChecked={isChecked}
                        />
                      </View>

                      {!isChecked && (
                        <View
                          style={{
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              ...AppStyle.TextStyle.descNormal,
                            }}>
                            Select Start Time
                          </Text>
                          <TouchableOpacity
                            style={styles.timeSelectButton}
                            onPress={showStartTimePicker}>
                            <Text
                              style={{
                                ...AppStyle.TextStyle.descNormal,
                              }}>
                              {selectStartTime != null &&
                                moment(selectStartTime).format('hh:mm')}
                            </Text>
                          </TouchableOpacity>
                          <Text style={styles.textColor}>Select End Time</Text>
                          <TouchableOpacity
                            onPress={showEndTimePicker}
                            style={styles.timeSelectButton}>
                            <Text
                              style={{
                                ...AppStyle.TextStyle.descNormal,
                              }}>
                              {selectEndTime != null &&
                                moment(selectEndTime).format('hh:mm')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      <DateTimePickerModal
                        isVisible={showEventDate}
                        mode="date"
                        onConfirm={handleEventConfirm}
                        onCancel={() => setshowEventDate(false)}
                      />
                      <DateTimePickerModal
                        isVisible={showEventEndDate}
                        mode="date"
                        onConfirm={handleEventLastConfirm}
                        onCancel={() => setshowEventEndDate(false)}
                      />
                      <DateTimePickerModal
                        isVisible={isStartTimePickerVisible}
                        mode="time"
                        is24Hour={true}
                        onConfirm={handleStartTimeConfirm}
                        onCancel={hideStartTimePicker}
                      />

                      <DateTimePickerModal
                        isVisible={isEndTimePickerVisible}
                        mode="time"
                        is24Hour={true}
                        onConfirm={handleEndTimeConfirm}
                        onCancel={hideEndTimePicker}
                      />

                      <View
                        style={{
                          marginTop: 10,
                        }}>
                        <Checkbox
                          onPress={() => setIsRepeat(!isrepeat)}
                          title="Repeat"
                          isChecked={isrepeat}
                        />
                      </View>
                      {isrepeat && (
                        <View
                          style={{
                            marginTop: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <RepeatDays
                              onPress={() => setActiveSunDay(!activeSunDay)}
                              isDayChecked={activeSunDay}
                              title="S"
                            />
                            <RepeatDays
                              onPress={() => setActiveMonDay(!activeMonDay)}
                              isDayChecked={activeMonDay}
                              title="M"
                            />
                            <RepeatDays
                              onPress={() => setActiveTueDay(!activeTueDay)}
                              isDayChecked={activeTueDay}
                              title="T"
                            />
                            <RepeatDays
                              onPress={() => setActiveWedDay(!activeWedDay)}
                              isDayChecked={activeWedDay}
                              title="W"
                            />
                            <RepeatDays
                              onPress={() => setActiveThuDay(!activeThuDay)}
                              isDayChecked={activeThuDay}
                              title="T"
                            />
                            <RepeatDays
                              onPress={() => setActiveFriDay(!activeFriDay)}
                              isDayChecked={activeFriDay}
                              title="F"
                            />
                            <RepeatDays
                              onPress={() => setActiveSatDay(!activeSatDay)}
                              isDayChecked={activeSatDay}
                              title="S"
                            />
                          </View>
                          <View
                            style={{
                              width: '100%',
                              marginTop: 10,
                            }}>
                            <Text style={styles.textColor}>Ends On</Text>

                            <TouchableOpacity
                              // value={selectEventEndOn}
                              style={styles.timeSelectButton}
                              onPress={() => {
                                setshowEventEndDate(true);
                              }}>
                              <Text style={styles.textColor}>
                                {' '}
                                {eventLastDate != null &&
                                  moment(eventLastDate).format('DD/MM/YYYY')}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </>
              ) : (
                ''
              )}
            </View>

            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: AppColors.borderColor,
                marginVertical: 5,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <Button
                raised
                mode="contained"
                theme={{roundness: 5}}
                labelStyle={{
                  color: AppColors.white,

                  ...AppStyle.TextStyle.descNormalPrimary,
                }}
                onPress={() => setshowModal(false)}
                style={{
                  marginTop: 20,
                  marginBottom: 5,
                  backgroundColor: AppColors.accent,
                  marginRight: 10,
                }}>
                Close
              </Button>

              {heading == 1 && (
                <Button
                  raised
                  mode="contained"
                  theme={{roundness: 5}}
                  labelStyle={{
                    color: AppColors.white,
                  }}
                  onPress={() => {
                    deleteEvent();
                  }}
                  style={{
                    marginTop: 20,
                    ...AppStyle.TextStyle.descNormalPrimary,
                    marginBottom: 5,
                    backgroundColor: AppColors.colorDanger,
                    marginRight: 10,
                  }}>
                  Delete
                </Button>
              )}
              <Button
                raised
                mode="contained"
                theme={{roundness: 5}}
                labelStyle={{
                  color: AppColors.white,

                  ...AppStyle.TextStyle.descNormalPrimary,
                }}
                onPress={() => {
                  heading == 0 ? addEvent() : updateEvent();
                }}
                style={{
                  marginTop: 20,
                  marginBottom: 5,
                  backgroundColor: AppColors.colorCyan,

                  ...AppStyle.TextStyle.descNormalPrimary,
                }}>
                {heading == 0 ? 'Save' : 'Update'}
              </Button>
            </View>
          </View>
        </ScrollView>
      </Modal>
      <Modal
        isVisible={showModalDetails}
        onBackdropPress={() => setshowModalDetails(false)}
        onSwipeComplete={() => setshowModalDetails(false)}
        swipeDirection="left"
        onBackButtonPress={() => setshowModalDetails(false)}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
          }}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View
              style={{
                backgroundColor: AppColors.white,
                elevation: 5,
                margin: 10,
                padding: 15,
                borderRadius: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // justifyContent:'center',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => setshowModalDetails(false)}
                  style={{padding: 5,alignSelf:'flex-start'}}>
                  <MaterialCommunityIcons name="close" size={25} />
                </TouchableOpacity>
                <View style={{flexDirection:'row',marginRight:40, justifyContent:'center',flex:1}}>
                <Image
                  source={Images.circle}
                  style={{
                    tintColor: eventDetails?.event.EventType.color_code,
                    height: 12,
                    width: 12,
                    alignSelf:'center'
                  }}
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginLeft: 5,
                    color: AppColors.black,
                    fontWeight: 'bold',
                  }}>
                  Event Details
                </Text>
                </View>
              </View>
              <View
                style={{
                  borderWidth: 0.3,
                  borderStyle: 'solid',
                  borderColor: AppColors.lightDivider,
                  marginTop: 4,
                }}
              />
              <View style={{flexDirection: 'row', paddingVertical: 10}}>
                <View style={{width: '50%'}}>
                  <Text style={{fontWeight: 'bold', color: AppColors.black}}>
                    Name
                  </Text>
                  <Text style={{color: AppColors.black}}>
                    {eventDetails?.event?.title}
                  </Text>

                  <View style={{}}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: AppColors.black,
                        marginTop: 5,
                      }}>
                      Description
                    </Text>
                    <Text style={{color: AppColors.black}}>
                      {eventDetails?.event?.description != ''
                        ? eventDetails?.event?.description
                        : '-'}
                    </Text>
                  </View>
                </View>
                <View style={{width: '48%'}}>
                  <Text style={{color: AppColors.black, fontWeight: 'bold'}}>
                    Event Type
                  </Text>
                  <Text style={{color: AppColors.black}}>
                    {eventDetails?.event.EventType.type}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: AppColors.black,
                      marginTop: 5,
                    }}>
                    Date
                  </Text>

                  <Text style={{color: AppColors.black}}>
                    {moment(eventDetails?.dd).format('DD-MM-YYYY')}
                  </Text>
                </View>
              </View>
              {eventDetails?.event?.isfullday == false ? (
                <View style={{paddingBottom: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 5,
                      color: AppColors.black,
                    }}>
                    Events Time
                  </Text>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View style={{width: '50%'}}>
                      <Text
                        style={{fontWeight: 'bold', color: AppColors.black}}>
                        Start Time
                      </Text>
                      <Text style={{color: AppColors.black}}>
                        {moment(eventDetails?.event?.start_time, [
                          'HH.mm',
                        ]).format('hh:mm a')}
                      </Text>
                    </View>
                    <View style={{width: '48%'}}>
                      <Text
                        style={{fontWeight: 'bold', color: AppColors.black}}>
                        End Time
                      </Text>
                      <Text style={{color: AppColors.black}}>
                        {moment(eventDetails?.event?.end_time, [
                          'HH.mm',
                        ]).format('hh:mm a')}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={{paddingVertical: 5}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 5,
                      color: AppColors.black,
                    }}>
                    Events Time
                  </Text>
                  <Text style={{fontWeight: 'bold', color: AppColors.black}}>
                    Full Day Event
                  </Text>
                </View>
              )}
              {eventDetails?.event?.repeat && (
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 5,
                      color: AppColors.black,
                    }}>
                    Repeat Events
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      alignItems: 'center',
                    }}>
                    <Text style={{color: AppColors.black}}>
                      {eventDetails?.event?.monday == true && 'Monday'}
                      {eventDetails?.event?.tuesday == true && ' - Tuesday'}
                      {eventDetails?.event?.wednesday == true && ' - Wednesday'}
                      {eventDetails?.event?.thursday == true && ' - Thursday'}
                      {eventDetails?.event?.friday == true && ' - Friday'}
                      {eventDetails?.event?.saturday == true && ' - Saturday'}
                      {eventDetails?.event?.sunday == true && ' - Sunday'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  outlineBtn: {
    borderColor: AppColors.borderColor,
    borderWidth: 1,
  },
  dropdown: {
    marginTop: 10,
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 5,
    marginBottom: 5,
    borderColor: '#ced4da',
  },
  icon: {
    marginRight: 5,
  },

  dropdownText: {
    // flex: 1,
    fontSize: 15,
    color: '#495057',
    backgroundColor: 'red',
  },
  input: {
    borderWidth: 0.8,
    marginVertical: 5,
    height: 45,
    borderColor: '#ced4da',
    borderRadius: 4,
    color: '#495057',
    paddingHorizontal: 10,
    marginBottom: 10,

    ...AppStyle.TextStyle.descNormal,
  },

  text: {
    color: AppColors.accentDark,
    fontSize: 15,
  },
  placeholderStyle: {
    fontSize: 15,
    color: '#000',
  },
  dropdownItem: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'black',
    fontSize: 14,
  },
  item: {
    // backgroundColor: '#E5E5E5',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: AppColors.accentBorder,
  },
  title: {
    fontSize: 18,
    paddingVertical: 3,
    color: AppColors.textPrimary,
  },
  des: {
    fontSize: 14,
    color: AppColors.textPrimary,
  },
  header: {
    paddingVertical: 5,
    paddingHorizontal: 30,
    marginBottom: 5,
  },
  line: {
    borderBottomWidth: 0.8,
    borderBottomColor: AppColors.borderColor,
    marginTop: 30,
  },
  textColor: {
    color: '#495057',
  },
  heading: {
    fontSize: 20,
    color: '#999',
  },
  accordianSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    padding: 4,
    marginTop: 5,
  },
  selectedTextStyle: {},
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 15,
    color: '#000',
  },
  timeSelectButton: {
    borderColor: '#ced4da',
    borderWidth: 0.6,
    borderRadius: 5,
    marginTop: 5,
    height: 45,
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  fabAddButton: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.calendarPrimary,
    color: AppColors.white,
  },
});

export default CalendarEvent;
