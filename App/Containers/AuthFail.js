import React, { Component } from 'react'
import { View, ImageBackground, Image, SafeAreaView, Text, ScrollView, TouchableOpacity} from 'react-native'
import { connect } from 'react-redux'
import { Images, Colors, Metrics, Fonts } from '../Themes'
import { Container, Content, Form, Item, Input, Spinner, Toast } from 'native-base';
import AuthActions from '../Redux/AuthRedux'
import FullButton from '../Components/FullButton'
import ModalDropdown from 'react-native-modal-dropdown';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/LoginScreenStyle'

type AuthFailProps = {
  dispatch: () => any,
  fetching: boolean,
  attemptLogin: () => void,
  passcode: number,
  error: string
}

class AuthFail extends Component {

  props: AuthFailProps

  state: {
    passcode: number,
    loading: boolean,
    error: string,
    editable: boolean,
    number: string,
  }

  isAttempting: boolean

  constructor (props: AuthFailProps) {

    super(props)

    this.state = {
      passcode : '',
      loading: false,
      error: '',
      editable: true,
      number: ''
  },

  this.isAttempting = false

}

  componentWillReceiveProps(nextProps) {

    if(this.props.fetching === true && nextProps.fetching === false && nextProps.error === null)
    {
      this.props.navigation.navigate('AuthFail');
    }
    if(this.props.fetching === true && nextProps.fetching === false && nextProps.error !== null)
    {
      Toast.show({
        text: nextProps.error,
        position: 'bottom',
        buttonText: 'Okay',
        type: 'danger',
        duration: 5000
      });
    }
  }

  componentDidMount() {
    setInterval( () => {
      const _hour = new Date().getHours();
      const _minute = new Date().getMinutes();
      const _second = new Date().getSeconds();
      function f(value){return value<10?('0'+value):value}
      const curTime=f(_hour) + ':' + f(_minute) + ':' + f(_second)
      this.setState({
        curTime
      })
    },1000)
  }

  handleChangePasscode = value => this.setState({ passcode: value });

  handleLogin = () => {

    if(this.state.passcode.length < 4 || this.state.passcode === ''){
      Toast.show({
        text: 'Enter valid passcode',
        position: 'bottom',
        buttonText: 'Okay',
        type: 'danger',
        duration: 5000
      });
    }else{
      this.setState({ loading: true , editable: false}, () => {
        this.isAttempting = true;
        this.props.attemptLogin(this.state.passcode);
      })
    }
  }

  renderHeader() {
    return (
      <View style={styles.headerView}>
        <Text style={[Fonts.style.description, { fontWeight: 'bold', fontFamily: Fonts.type.emphasis, margin: 10, marginBottom: 6 }]}>
          shop-online loader 2.4
        </Text>
        <Text style={[Fonts.style.description, { fontFamily: Fonts.type.emphasis, marginHorizontal: 10 }]}>
          WWW.BARCODE2STORE.com
        </Text>
        <View style={{flex:1}}/>
        <View>
          <Text style={[Fonts.style.h6, {textAlign: 'center', fontWeight: 'bold', fontFamily: Fonts.type.emphasis, marginHorizontal: 10 }]}>
            BARCODE - ONLINE
          </Text>
          <Text style={[Fonts.style.description, {textAlign: 'center', fontFamily: Fonts.type.emphasis, marginHorizontal: 10, marginBottom: 3 }]}>
            загрузка товаров в магазин
          </Text>
          <View style={{height:1, backgroundColor: '#e9eef5'}}/>
        </View>
      </View>
    )
  }

  _renderDropRow= (rowData, sectionID, rowID, highlightRow)=>
  {
    const flag = Images[`flag_${rowData}`];
    return( 
    <View style={{flexDirection:'column'}}>
      <View style={{padding: Metrics.defaultMargin, backgroundColor: Colors.white, flexDirection: 'row', alignItems: 'center'}}>
        <Image resizeMode='stretch' style={{marginLeft: Metrics.WIDTH(10), width: Metrics.WIDTH(30), height: Metrics.HEIGHT(20)}} source={flag}/>
        <Text style={[Fonts.style.h6, {color: Colors.textSecondary, textAlign: 'center', fontWeight: 'bold', fontFamily: Fonts.type.emphasis, marginHorizontal: 10 }]}>
          {rowData.toUpperCase()}
        </Text>
      </View>
      <View style={{height:1, backgroundColor: '#e9eef5'}}/>
    </View>)
  }

  onChangeNumber = number => {
    this.setState({number})
  }

  gotoLogin = () => {
    this.props.navigation.navigate('AuthFail');
  }

  renderSend(){
    return(
      <ImageBackground resizeMode='stretch' source={Images.button} style={styles.sendButton}>
        <TouchableOpacity onPress={this.gotoLogin}>
          <View style={{flexDirection:'row', alignItems: 'center'}}>
            <Text style={[Fonts.style.h6, { color: 'black', fontFamily: Fonts.type.bigItalic, marginHorizontal: 10 }]}>
              выход
            </Text>
            <Image resizeMode='stretch' style={{marginRight: Metrics.WIDTH(20), width: Metrics.WIDTH(23), height: Metrics.HEIGHT(18)}} source={Images.exit}/>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    )
  }

  _onSelect=(id, data)=>{
    console.log('Data=', data);
    this.props.setLang(data);
  }
  renderTimeBar(){
    return(
      <ImageBackground resizeMode='stretch' source={Images.bottomBar} style={styles.bottomBar}>
         <View style={{height: Metrics.HEIGHT(70)}}/>
         
          <Text style={[Fonts.style.description, {textAlign: 'center', fontFamily: Fonts.type.emphasis, marginHorizontal: 10, marginBottom: 3 }]}>
            время
          </Text>
          <Text style={[Fonts.style.h6, {textAlign: 'center', fontWeight: 'bold', fontFamily: Fonts.type.emphasis, marginHorizontal: 10 }]}>
            {this.state.curTime}
          </Text>
      </ImageBackground>
    )
  }

  onPressBack = () => {
    this.props.navigation.goBack();
  }

  renderForm() {
    const flag = Images[`flag_${this.props.lang}`];
    const dropOptions = ['ru', 'de', 'eng', 'esp', 'fr', 'he', 'it'].filter(x=>x!=this.props.lang);
    // const dropOptions = ['ru', 'de', 'eng']
    return (
      <ImageBackground resizeMode='stretch' source={Images.loginForm} style={styles.loginForm}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Metrics.HEIGHT(8) }}>
          <View style={{flex:1}}/>
          <Image resizeMode='stretch' style={{width: Metrics.screenWidth*30/460, height: Metrics.screenHeight * 20 / 970}} source={flag}/>
          <Text style={[Fonts.style.h6, {color: Colors.textSecondary, textAlign: 'center', fontWeight: 'bold', fontFamily: Fonts.type.emphasis, marginHorizontal: 10 }]}>
            {this.props.lang.toUpperCase()}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{flex:1}}/>
          <ModalDropdown options={dropOptions} onSelect={this._onSelect} renderRow={this._renderDropRow}
            dropdownStyle={styles.dropDown} onDropdownWillHide={()=>{  return true;}}>
            <Image style={{width: Metrics.WIDTH(15), height: Metrics.HEIGHT(10), marginTop: Metrics.HEIGHT(10), marginRight: Metrics.WIDTH(15)}} resizeMode='stretch' source={Images.triangle}/>
          </ModalDropdown>
        </View>
        <Text style={[Fonts.style.h3, { color: 'black', textAlign: 'right',  fontFamily: Fonts.type.bigItalic, marginHorizontal: 20 }]}>
          У Вас нет доступа {'\n'} к этой аппликации
        </Text>
        <Text style={[Fonts.style.h6, {color: 'black', marginTop: -10, textAlign: 'right', fontFamily: Fonts.type.lightItalic, marginHorizontal: 20 }]}>
        по всем вопросам обращайтесь {'\n'} на сайт-платформу {'\n'} www.barcode2store.com {'\n'}
        </Text>
        <Text style={[Fonts.style.h4, {color: 'black', marginTop: -10, textAlign: 'right', fontFamily: Fonts.type.bigItalic, marginHorizontal: 20 }]}>
        с уважением {'\n'} компания {'\n'} shop-online  {'\n'}
        </Text> 
        <View style={{height: Metrics.HEIGHT(20)}}/>
        
      </ImageBackground>
    )
  }

  render () {
    return (
    <SafeAreaView style={styles.whiteContent}>
      <Container>
        <ScrollView scrollEnabled={false}>
          <View style={{ height: Metrics.screenHeight * 143 / 964 }}>
            {this.renderHeader()}
          </View>
          <View style={{ height: Metrics.screenHeight * 405 / 964 }}>
            {this.renderForm()}
          </View>
          {this.renderSend()}     
          {this.renderTimeBar()}
        </ScrollView>
      </Container>
    </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching:state.auth.fetching,
    error:state.auth.error,
    passcode:state.auth.passcode,
    lang: state.auth.lang,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    verifyPhoneNumber: (lang, number) => dispatch(AuthActions.verifyRequest(lang, number)),
    setLang: lang => dispatch(AuthActions.setLang(lang))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthFail)
