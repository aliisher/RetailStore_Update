import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../Components/Header';
import {mainContainer} from '../../Constants/StyleSheet';
import {hp, isMobileScreen, wp} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import {Fonts, fontSize} from '../../Constants/Fonts';
import InVoiceDetailComp from '../../Components/InVoiceDetailComp';
import ProductInvoiceDetailComp from '../../Components/ProductInvoiceDetailComp';
import {Divider} from '@rneui/base';
import Btn from '../../Components/Btn';
import {useNavigation} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {request} from '../../Api_Services/ApiServices';
import {EMPTY_CARD} from '../../Redux/Features/CardSlice';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import {Config} from '../../Api_Services/Config';
import {EMPTY_RECOMMENDED_CARD} from '../../Redux/Features/RecommendedCardSlice';
import Toast from 'react-native-simple-toast';

const InVoice = ({route}) => {
  const dispatch = useDispatch();
  const routeData = route?.params;
  const recommed = route?.params?.recommended;
  const navigation = useNavigation();
  const [pdfPath, setPdfPath] = useState(null);
  const getCardData = useSelector(state => state?.CARD?.CART);
  const storeData = useSelector(state => state?.AUTH?.storeData);
  const RECOMMENDED_CARD = useSelector(
    state => state?.RECOMMAND_CARD?.RECOMMENDED_CART,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [loadingButton, setLoadingButton] = useState(null);

  useEffect(() => {
    generateShortInvoiceNumber();
    getLogo();
  }, []);

  const getLogo = async () => {
    await request
      .get('logo')
      .then(response => {
        if (response?.data?.status == 'success') {
          setImagePath(Config?.domain + response?.data?.banners[0]?.image);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('err', JSON?.stringify(err, null, 2));
      });
  };
  const cardData = recommed ? RECOMMENDED_CARD : getCardData;
  const placeOrder = async (PDF, buttonType) => {
    // if (!discount) {
    //   Toast.show('Discount not found', Toast.SHORT);
    // } else {
    setLoadingButton(buttonType);

    const formData = new FormData();
    const selectedItems = cardData.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      image: item?.image || '',
      product_name: item?.product_name,
      discount: discount,
    }));

    // Append necessary data to formData
    formData.append('store_manager_id', cardData[0]?.store_manager_id);
    formData.append('store_id', cardData[0]?.store_id);
    formData.append('vendor_id', cardData[0]?.vendor_id);
    formData.append('store_manager_name', cardData[0]?.store_manager_name);
    formData.append('store_name', cardData[0]?.store_name);
    formData.append('vendor_name', cardData[0]?.vendor_name);
    formData.append('store_address', storeData?.store_address);
    formData.append('store_phone_no', storeData?.store_phone_no);
    formData.append('invoice_number', invoiceNumber);
    formData.append('date', formattedDate);
    formData.append('total_price', finalPrice);
    formData.append('total_quantity', routeData?.product_Quantity);
    formData.append('products', JSON.stringify(selectedItems));
    formData.append('status', 'In-Progress');

    try {
      const response = await request.post('orders', formData);

      const res = response?.data;
      if (res?.order) {
        Toast.show(res?.message, Toast.SHORT);

        handleOrderCompletion(PDF);
      }
    } catch (err) {
      console.log('err', JSON.stringify(err, null, 2));
    } finally {
      setLoadingButton(null);
    }
  };

  const handleOrderCompletion = PDF => {
    if (PDF) {
      generatePDF();
    }
    setIsVisible(false);

    if (recommed) {
      dispatch(EMPTY_RECOMMENDED_CARD());
    }

    dispatch(EMPTY_CARD());
    navigation.replace('MyOrder', {title: 'My Orders'});
  };

  const saveOrder = () => {
    setLoading1(true);
    const formData = new FormData();
    const selectedItems = cardData.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      image: item?.image || '',
      product_name: item?.product_name,
      discount: discount,
    }));
    formData?.append('store_manager_id', cardData[0]?.store_manager_id);
    formData?.append('store_id', cardData[0]?.store_id);
    formData?.append('vendor_id', cardData[0]?.vendor_id);
    formData?.append('store_manager_name', cardData[0]?.store_manager_name);
    formData?.append('store_name', cardData[0]?.store_name);
    formData?.append('vendor_name', cardData[0]?.vendor_name);
    formData?.append('store_address', storeData?.store_address);
    formData?.append('store_phone_no', storeData?.store_phone_no);
    formData?.append('invoice_number', invoiceNumber);
    formData?.append('date', formattedDate);
    formData?.append('total_price', finalPrice);
    formData?.append('total_quantity', routeData?.product_Quantity);
    formData?.append('products', JSON?.stringify(selectedItems));
    formData?.append('status', 'pending');
    request
      .post('orders', formData)
      .then(response => {
        const res = response?.data;
        if (res?.order) {
          setLoading1(false);
          if (recommed) {
            dispatch(EMPTY_RECOMMENDED_CARD());
          }
          dispatch(EMPTY_CARD());

          navigation.replace('MyOrder', {
            title: 'Saved Orders',
            status: 'Pending',
          });
        }
      })
      .catch(err => {
        setLoading1(false);
        console.log('errssss', JSON?.stringify(err.message, null, 2));
      })
      .finally(() => {
        setLoading1(false);
      });
  };

  const generateShortInvoiceNumber = () => {
    const timestamp = Date.now().toString().slice(-5);
    const randomNum = Math.floor(Math.random() * 10000);
    return `INV-${timestamp}-${randomNum}`;
  };
  const invoiceNumber = generateShortInvoiceNumber();

  const formatDate = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  const discount = route?.params?.recommended
    ? RECOMMENDED_CARD[0]?.discount
    : getCardData[0]?.discount || 0;
  const productPrice = routeData?.product_Price || 0;

  const discountAmount = ((productPrice * discount) / 100).toFixed(2);
  const finalPrice = (productPrice - discountAmount).toFixed(2);

  const generatePDF = async () => {
    const discount = cardData[0]?.discount || 0;
    const productPrice = routeData?.product_Price || 0;

    // Correct discount calculation
    const discountAmount = ((productPrice * discount) / 100).toFixed(2); // Keep 2 decimal places for precision

    // Calculate final price
    const finalPrice = (productPrice - discountAmount).toFixed(2);

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .invoice-container {
              padding: 20px;
            }
            .logo {
              display: block;
              margin: 0 auto; /* Center the logo horizontally */
              width: 150px; /* Adjust size as needed */
              margin-bottom: 10px;
            }
            .header {
              text-align: center;
              background-color: #005FAC;
              color: white;
              padding: 10px;
              font-size: 24px;
              font-weight: bold;
            }
            .details {
              margin-top: 20px;
              display: flex;
              justify-content: space-between;
            }
            .details p {
              margin: 5px 0;
            }
            .table {
              width: 100%;
              margin-top: 20px;
              border-collapse: collapse;
            }
            .table th, .table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .table th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .payable {
              text-align: right;
              margin-top: 20px;
              font-size: 20px;
              font-weight: bold;
            }
            .buttons {
              margin-top: 30px;
              text-align: center;
            }
            .buttons .btn {
              padding: 10px 20px;
              margin: 5px;
              border: none;
              color: white;
              font-size: 16px;
            }
            .btn-primary {
              background-color: #005FAC;
            }
            .btn-secondary {
              background-color: #ffffff;
              color: #005FAC;
              border: 1px solid #005FAC;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <img src="${imagePath}" class="logo" alt="Logo" />
            <div class="header">Invoice</div>
            <div class="details">
              <div>
                <p>Date: ${formattedDate}</p>
                <p>Store Manager: ${cardData[0]?.store_manager_name}</p>
                <p>Invoice for: ${cardData[0]?.vendor_name}</p>
                <p>Store Phone: ${storeData?.store_phone_no}</p>
              </div>
              <div>
                <p>Invoice#: ${invoiceNumber}</p>
                <p>Store Name: ${cardData[0]?.store_name}</p>
                <p>Store Address: ${storeData?.store_address}</p>
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>QTY</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${cardData
                  .map(
                    product =>
                      `<tr>
                        <td>${product.product_name}</td>
                        <td>${product.quantity}</td>
                        <td>$${product.price}</td>
                      </tr>`,
                  )
                  .join('')}
              </tbody>
            </table>
            <div class="payable">
              Sub Total: $${productPrice}<br>
              Discount: $${discount}<br>
              Payable: $${finalPrice}
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const options = {
        html: htmlContent,
        fileName: 'invoice',
        directory: 'Documents',
      };

      const pdf = await RNHTMLtoPDF.convert(options);
      console.log('PDF generated at:', pdf.filePath);
      setPdfPath(pdf.filePath);

      // Share options
      const shareOptions = {
        title: 'Share PDF',
        url: `file://${pdf.filePath}`,
        type: 'application/pdf',
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <SafeAreaView style={mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title="Invoice" onPress={() => navigation.goBack()} />

        <View style={styles.invoiceView}>
          <Text style={styles.invoiceText}>Invoice</Text>
        </View>

        <InVoiceDetailComp
          data={recommed ? RECOMMENDED_CARD : getCardData}
          date={formattedDate}
          invoice={invoiceNumber}
          storeData={storeData}
        />
        <Divider orientation="horizontal" style={styles.dividerStyle} />
        <ProductInvoiceDetailComp recommed={recommed} />
        <Divider orientation="horizontal" style={styles.dividerStyle1} />
        <View style={styles.productDetailView}>
          <Text style={styles.productName}>Sub Total</Text>
          <Text style={styles.productQty}>{routeData?.product_Quantity}</Text>
          <Text style={styles.subtotalProductPrice}>
            ${routeData?.product_Price}
          </Text>
        </View>
        <Divider orientation="horizontal" style={styles.dividerStyle1} />
        <View style={styles.productDetailView}>
          <Text style={styles.discountProductName}>
            Discount Apply (
            {route?.params?.recommended
              ? RECOMMENDED_CARD[0]?.discount
              : getCardData[0]?.discount}
            %)
          </Text>
          <Text style={styles.productPrice}>
            ${Number(finalPrice).toFixed(2)}
          </Text>
        </View>
        <Divider orientation="horizontal" style={styles.dividerStyle2} />
        <View style={styles.payableView}>
          <Text style={styles.payableText}>Payable</Text>
          <Text style={styles.dollarText}>${finalPrice}</Text>
        </View>

        <Btn
          text={'Place Order'}
          fontSize={fontSize.L}
          width={wp(90)}
          onPress={() => {
            setIsVisible(true);
          }}
          marginTop={hp(2.5)}
        />
        <Btn
          marginTop={hp(3)}
          width={wp(90)}
          text={'Save Order For Later'}
          fontSize={fontSize.L}
          spinnerColor={Colors?.primary}
          textColor={Colors.primary}
          backgroundColor={Colors.white}
          loading={loading1}
          marginBottom={hp(10)}
          onPress={() => saveOrder()}
        />

        <Modal
          visible={isVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
            <View style={styles.mainView}>
              <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                <View style={styles.modalBody}>
                  <Btn
                    text={'Place Order & Print'}
                    onPress={() => placeOrder(true, 'print')}
                    fontSize={fontSize.L}
                    loading={loadingButton == 'print'}
                    width={wp(75)}
                  />
                  <Btn
                    marginTop={hp(5)}
                    width={wp(75)}
                    text={'Place Order'}
                    fontSize={fontSize.L}
                    textColor={Colors.primary}
                    backgroundColor={Colors.white}
                    spinnerColor={Colors?.primary}
                    onPress={() => placeOrder(false, 'place')}
                    loading={loadingButton == 'place'}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InVoice;
const styles = StyleSheet.create({
  modalBody: {
    backgroundColor: Colors.white,
    height: isMobileScreen ? hp('30%') : hp('45%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(5),
    borderRadius: hp(1),
    width: wp(89),
  },
  invoiceView: {
    width: wp(47),

    marginTop: hp(3),
    backgroundColor: 'red',
  },
  invoiceText: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontSize: fontSize.XL2,
    paddingHorizontal: wp(5),
  },
  dividerStyle: {
    borderWidth: 0.2,
    width: wp(90),
    marginTop: hp(5),
    marginBottom: hp(1.5),
    borderColor: Colors.chineseBlack,
  },
  dividerStyle1: {
    borderWidth: 0.2,
    width: wp(90),
    marginTop: hp(1.5),
    marginBottom: hp(1.5),
    borderColor: Colors.chineseBlack,
  },
  dividerStyle2: {
    borderWidth: 0.2,
    width: wp(90),
    marginTop: hp(1.5),
    marginBottom: hp(1.5),
    borderColor: Colors.chineseBlack,
  },
  productDetailView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: wp(90),
  },
  productName: {
    color: Colors.raisinBlack,
    fontSize: fontSize.S1,
    fontFamily: Fonts.semiBold,
    width: wp(41),
  },
  discountProductName: {
    color: Colors.raisinBlack,
    fontSize: fontSize.S1,
    fontFamily: Fonts.semiBold,
    width: wp(45),
  },
  productQty: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.S,
    marginRight: '3%',
  },
  productPrice: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.S,
    textAlign: 'right',
    width: wp('14%'),
  },
  subtotalProductPrice: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.S,
    textAlign: 'right',
    width: wp('14%'),
  },
  payableText: {
    color: Colors.chineseBlack,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.L1,
  },
  dollarText: {
    color: Colors.chineseBlack,
    fontFamily: Fonts.bold,
    fontSize: fontSize.L1,
  },
  payableView: {
    width: wp(90),
    alignItems: 'flex-end',
    marginTop: hp(5),
  },
  mainView: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainContainer: {
    flex: 1,
    width: wp(100),
    backgroundColor: Colors.white,
  },
});
