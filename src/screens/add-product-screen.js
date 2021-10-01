import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
// import t from 'tcomb-form-native';
// const Form = t.form.Form;
// const User = t.struct({
//   name: t.String,
//   price: t.Number,
//   description: t.String,
// });
const AddProductScreen = ({navigation}) => {
  // const [form, setForm] = useState(null); 
  // const [initialValues, setInitialValues] = useState({});
  // const options = {
  //   auto: 'placeholders',
  //   fields: {
  //     description: {
  //       multiLine: true,
  //       stylesheet: {
  //         ...Form.stylesheet,
  //         textbox: {
  //           ...Form.stylesheet.textbox,
  //           normal: {
  //             ...Form.stylesheet.textbox.normal,
  //             height: 100,
  //             textAlignVertical: 'top',
  //           },
  //         },
  //       },
  //     },
  //   },
  // };
const handleSubmit = async () => {
    // Saving product details
  };
return (
    <>
      
    </>
  );
};
const styles = StyleSheet.create({
  addProductView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 15,
    height: 'auto',
  },
});
export default AddProductScreen;