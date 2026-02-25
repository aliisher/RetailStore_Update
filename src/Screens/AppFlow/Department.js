import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TextInputComp from '../../Components/TextInputComp';
import {searchImg} from '../../Assets/Index';
import {hp, wp} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {TouchableOpacity} from 'react-native';
import {mainContainer} from '../../Constants/StyleSheet';
import DepartmentComp from '../../Components/DepartmentComp';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Header from '../../Components/Header';
import {request} from '../../Api_Services/ApiServices';
import {useSelector} from 'react-redux';

const Department = ({route}) => {
  const recommed = route?.params;
  const venderId = route?.params?.vender_Id;
  const storeGet = useSelector(state => state.AUTH?.storeData);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState({
    emailError: '',
  });
  const [userData, setUserData] = useState({
    email: '',
  });
  const [departmentsData, setDepartmentsData] = useState('');
  useEffect(() => {
    if (isFocused) {
      getDepatmentData();
    }
  }, [isFocused]);
  const getDepatmentData = async () => {
    setLoading(true);
    try {
      const response = await request.get(
        `departments/${venderId}/${storeGet?.store_manager_id}/${storeGet?.store_id}`,
      );
      setDepartmentsData(response?.data?.storeDepartments);
    } catch (err) {
      console.log('Error@b', JSON.stringify(err.response, null, 2));
    } finally {
      setLoading(false);
    }
  };
  const handleNavigation = id => {
    navigation.navigate('Products', {
      department_ID: id,
      vender_Id: venderId,
      recommend: recommed?.recommend ? true:false,
    });
  };
  const filterChat = userData?.email
    ? departmentsData.filter(item =>
        item?.department_name
          ?.toLowerCase()
          .includes(userData?.email.toLowerCase()),
      )
    : departmentsData;
  return (
    <SafeAreaView style={mainContainer}>
      <Header title="Departments" titleStyle={styles.titleStyle} />
      <TextInputComp
        inputCotainer={styles.textInput}
        imgSource={searchImg}
        iconName={'search'}
        placeholder={'Search here'}
        value={userData.email}
        keyboardType={''}
        errorMessage={errorMessage?.degreeError}
        onChangeText={text => {
          setErrorMessage(prevState => ({
            ...prevState,
            degreeError: null,
          }));
          setUserData(prevState => ({...prevState, email: text}));
        }}
      />
      <View style={styles.flatListView}>
        {loading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading Department...</Text>
          </View>
        ) : filterChat?.length > 0 ? (
          <FlatList
            data={filterChat}
            numColumns={2}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.flatlistStyle}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => handleNavigation(item?.id)}>
                <DepartmentComp
                  imgSource={item?.image}
                  title={item?.department_name}
                  text={item?.tax_status}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={{color: 'black'}}>No data found</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Department;

const styles = StyleSheet.create({
  wholesaleText: {
    marginTop: hp(3),
    color: Colors.raisinBlack,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.Normal1,
  },
  itemContainer: {
    padding: wp(2),
  },
  flatListView: {
    flex: 1,
    marginTop: hp(2),
  },
  modalBody: {
    backgroundColor: Colors.white,
    height: hp(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(5),
    borderRadius: hp(1),
    width: wp(89),
  },
  mainView: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStyle: {
    width: wp(20),
    height: wp(6),
  },
  loadingText: {
    marginTop: hp(2),
    fontFamily: Fonts.medium,
    fontSize: fontSize.S1,
    color: Colors.primary,
  },
});
