import React from 'react';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import AppColors from './common/AppColor';
import AppStyle from './common/AppStyle';
import {ScrollView} from 'react-native-gesture-handler';
import ApiCalling from './network/ApiCalling';
import Util from './utils/Util';
import moment from 'moment';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentDidMount() {
    this.getNotification();
  }
  getNotification = async () => {
    try {
      Util.getSelectedChild().then(data => {
        console.log(data.id);
        ApiCalling.apiCallParamsGet('notification/list/' + data.id).then(
          res => {
            // console.log("Notification list=",res.data);
            var groups = res.data?.reduce((groups, game) => {
              // console.log('List=', game.sent_on);

              const date = game.sent_on?.split('T')[0];
              if (!groups[date]) {
                groups[date] = [];
              }

              groups[date].push(game);
              return groups;
            }, {});

            var groupArrays = Object.keys(groups).map(date => {
              console.log(date);
              return {
                date,
                notiList: groups[date],
              };
            });
            this.setState({data: groupArrays});
            console.log('Group array', groupArrays);
          },
        );
      });
    } catch (error) {}
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state?.data}
          // style={{flex: 1}}
          renderItem={({item}) => {
            console.log(item);
            var date = '';
            if (item?.date == moment().format('YYYY-MM-DD')) {
              date = 'Today';
            } else if (
              moment(item?.date).format('YYYY-MM-DD') >=
              moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD')
            ) {
              date = moment(item?.date).format('dddd');
            } else {
              date = moment(item?.date).format('DD-MM-YYYY');
            }
            return (
              <View style={{flex: 1}}>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        date == 'Today'
                          ? AppColors.todayColor
                          : AppColors.badgeColor,
                    },
                  ]}>
                  <Text
                    style={{
                      color: AppColors.white,
                      textAlign: 'center',
                      ...AppStyle.TextStyle.titleNormal,
                      paddingHorizontal: 4,
                      paddingVertical: 2,
                      fontSize: 12,
                    }}>
                    {date}
                  </Text>
                </View>
                <FlatList
                  data={item?.notiList}
                  // style={{flex:1}}
                  renderItem={({item, index}) => {
                    return (
                      <View style={styles.list}>
                        <Image
                          source={require('./assets/profile_img.png')}
                          style={styles.imageStyle}
                        />

                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                          }}>
                          <Text style={styles.titleText}>{item.title}</Text>

                          <View
                            style={{
                              justifyContent: 'flex-end',
                              display: 'flex',
                            }}>
                            <Text style={styles.hoursText}>
                              {moment(item.sent_on).fromNow()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            );
          }}
        />
      </View>
    );
  }
}

export default Feed;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.settingbgColor,
  },
  badge: {
    width: 90,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 20,
  },
  list: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 15,
    marginTop: 10,
  },
  imageStyle: {width: 40, height: 40, borderRadius: 50, marginRight: 10},
  hoursText: {
    ...AppStyle.TextStyle.inputTextFont,
    color: AppColors.subTitleColor,
    fontSize: 12,
  },
  titleText: {
    ...AppStyle.TextStyle.descNormalPrimary,
    color: AppColors.primaryTextColor,
  },
});
