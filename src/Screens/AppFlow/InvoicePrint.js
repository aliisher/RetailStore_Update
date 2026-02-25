import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../Components/Header';
import {mainContainer} from '../../Constants/StyleSheet';
import {hp, wp} from '../../Constants/Responsive';
import {Colors} from '../../Constants/Colors';
import {Fonts, fontSize} from '../../Constants/Fonts';
import {Divider} from '@rneui/base';
import {useNavigation} from '@react-navigation/native';
import {printImg} from '../../Assets/Index';
import InVoiceOrderDetailComp from '../../Components/InvoiceOrderDetailComp';
import ProductOrderInvoiceDetailComp from '../../Components/ProductOrderInvoiceDetailComp';
import Btn from '../../Components/Btn';
import {request} from '../../Api_Services/ApiServices';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import {Config} from '../../Api_Services/Config';
import {useSelector} from 'react-redux';

const InvoicePrint = ({route}) => {
  const {item, title} = route?.params || {};
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [pdfPath, setPdfPath] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [price, setPrice] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const storeData = useSelector(state => state?.AUTH?.storeData);

  const discount = item?.order_item[0]?.discount_price;
  const productPrice = item?.total_price || 0;
  const discountAmount = ((productPrice * discount) / 100).toFixed(2);
  const finalPrice = (productPrice - discountAmount).toFixed(2);

  const placeOrder = () => {
    setLoading(true);
    const formData = new FormData();
    let selectedItems = [];
    const product_Data = {
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      image: item.image || '',
      product_name: item?.product_name,
    };
    selectedItems?.push(product_Data);

    formData?.append('storeManagerId', item?.store_manager_id);
    formData?.append('storeId', item?.store_id);
    formData?.append('orderId', item?.order_code);

    request
      .post('orderStatus', formData)
      .then(response => {
        const res = response?.data;
        setLoading(false);
        if (res?.order) {
          navigation.navigate('MyOrder', {title: 'My Orders'});
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('err', JSON?.stringify(err, null, 2));
      });
  };
  useEffect(() => {
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
  const generatePDF = async () => {
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
          .header {
            text-align: center;
            background-color: #005FAC;
            color: white;
            padding: 10px;
            font-size: 24px;
            font-weight: bold;
          }
         .logo {
          display: block;
          margin: 0 auto; /* Center the logo horizontally */
          width: 150px; /* Adjust size as needed */
          margin-bottom: 10px;
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
            border-bottom: 1px solid #ddd;
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
          .subtotal-row td {
            border-top: 2px solid black;
            font-weight: bold;
          }
          .total-row td {
            font-weight: bold;
            color: #005FAC;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <img src="${imagePath}" class="logo" alt="Logo" />
          <div class="header">Invoice</div>
          <div class="details">
            <div>
              <p>Date: ${item?.date}</p>
              <p>Store Manager: ${item?.store_manager_name}</p>
              <p>Invoice for: ${item?.vendor?.vendor_name}</p>
                <p>Store Phone: ${storeData?.store_phone_no}</p>

            </div>
            <div>
              <p>Invoice#: ${item?.invoice_number}</p>
              <p>Store Name: ${item?.store_name}</p>
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
              ${item?.order_item
                .map(
                  product => `
                    <tr>
                      <td>${product.product_name}</td>
                      <td>${product.quantity}</td>
                      <td>$${product.price}</td>
                    </tr>`,
                )
                .join('')}
              <tr class="subtotal-row">
                <td>Sub total</td>
                <td>${item?.total_quantity}</td>
                <td>$${price}</td>
              </tr>
               <tr class="subtotal-row">
                <td>Discount  ${item?.order_item[0]?.discount_price}%</td>
                <td></td>
                <td>$${discountedPrice}</td>
              </tr>
            </tbody>
          </table>
          ${
            title === 'Saved Orders'
              ? `<div class="payable">
              Payable: $${discountedPrice}
            </div>`
              : ''
          }
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

  useEffect(() => {
    let totalQuantity = 0;
    let totalPrice = 0;
    let discountPercentage = Number(item?.order_item[0]?.discount_price) || 0;

    item?.order_item?.forEach(product => {
      const quantity = Number(product.quantity) || 0;
      const price = Number(product.price) || 0;

      totalQuantity += quantity;
      totalPrice += quantity * price;
    });

    const discountedPrice =
      totalPrice - (totalPrice * discountPercentage) / 100;

    setTotalQuantity(totalQuantity);
    setPrice(totalPrice.toFixed(2));
    setDiscountedPrice(discountedPrice.toFixed(2));
  }, [item?.order_item]);

  return (
    <SafeAreaView style={mainContainer}>
      <Header
        title="Invoice"
        imgSource={printImg}
        imgPress={() => generatePDF()}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.invoiceView}>
        <Text style={styles.invoiceText}>Invoice</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <InVoiceOrderDetailComp
          data={item}
          date={item?.date}
          invoice={item?.order_code}
          storeData={storeData}
        />
        <Divider orientation="horizontal" style={styles.dividerStyle} />
        <ProductOrderInvoiceDetailComp productData={item?.order_item} />
        <Divider orientation="horizontal" style={styles.dividerStyle1} />
        <View style={styles.productDetailView}>
          <Text style={styles.productName}>Sub total</Text>
          <Text style={styles.productQty}>{totalQuantity}</Text>
          <Text style={styles.subtotalProductPrice}>
            ${parseFloat(price).toFixed(2)}
          </Text>
        </View>
        <Divider orientation="horizontal" style={styles.dividerStyle1} />
        <View style={styles.productDetailView}>
          <Text style={styles.discountProductName}>
            Discount Apply ({item?.order_item[0]?.discount_price}
            %)
          </Text>
          <Text style={styles.productPrice}>
            ${Number(discountedPrice).toFixed(2)}
          </Text>
        </View>
        {title == 'Saved Orders' && (
          <>
            <Divider orientation="horizontal" style={styles.dividerStyle2} />
            <View style={styles.payableView}>
              <Text style={styles.payableText}>Payable</Text>
              <Text style={styles.dollarText}>${discountedPrice}</Text>
            </View>
            <Btn
              text={'Place Order'}
              fontSize={fontSize.L}
              width={wp(90)}
              loading={loading}
              onPress={() => placeOrder()}
              marginTop={hp(2.5)}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InvoicePrint;

const styles = StyleSheet.create({
  modalBody: {
    backgroundColor: Colors.white,
    height: hp(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(5),
    borderRadius: hp(1),
    width: wp(89),
  },
  invoiceView: {
    width: wp(100),
    marginTop: hp(3),
  },
  invoiceText: {
    width: wp(47),
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
    marginBottom: hp(10),
    borderColor: Colors.chineseBlack,
  },
  productDetailView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: wp(90),
  },
  discountProductName: {
    color: Colors.raisinBlack,
    fontSize: fontSize.S1,
    fontFamily: Fonts.semiBold,
    width: wp(45),
  },
  productName: {
    color: Colors.raisinBlack,
    fontSize: fontSize.S1,
    fontFamily: Fonts.semiBold,
    width: wp(40),
  },
  productQty: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
    fontSize: fontSize.S,
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
    width: wp('13%'),
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
});
