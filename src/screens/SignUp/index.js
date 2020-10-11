import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { UserContext } from '../../contexts/UserContext';
import {
    Container,
    InputArea,
    CustomButton,
    CustomButtonText,
    SignMessageButton,
    SignMessageButtonText,
    SignMessageButtonTextBold
} from './styles.js';

import SignInput from '../../components/SignInput';

import Api from '../../Api';

import BarberIcon from '../../assets/barber.svg';
import EmailIcon from '../../assets/email.svg';
import LockIcon from '../../assets/lock.svg';
import PersonIcon from '../../assets/person.svg';

export default () => {
    const { dispatch: UserDispatch } = useContext(UserContext);
    const navigation = useNavigation();

    const [nameField, setNameField] = useState('');
    const [emailField, setEmailField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const handlerSaveButtonClick = async () => {
        if (nameField != '' && emailField != '' && passwordField != '') {
            let res = await Api.signUp(nameField, emailField, passwordField);

            if (res.token) {
                await AsyncStorage.setItem('token', res.token);

                UserDispatch({
                    type: 'setAvatar',
                    payload: {
                        avatar: res.data.avatar
                    }
                });

                navigation.reset({
                    routes: [{ name: 'MainTab' }]
                })
            }
        } else {
            alert("Preencha os campos!")
        }
    }

    const handlerLoginButtonClick = () => {
        navigation.reset({
            routes: [{ name: 'SignIn' }]
        })
    }

    return (
        <Container>
            <BarberIcon width="100%" height="160" />

            <InputArea >
                <SignInput IconSvg={PersonIcon} placeholder="Digite seu nome" value={nameField}
                    onChangeText={t => setNameField(t)} />

                <SignInput IconSvg={EmailIcon} placeholder="Digite seu e-mail" value={emailField}
                    onChangeText={t => setEmailField(t)} />

                <SignInput IconSvg={LockIcon} placeholder="Digite sua senha" value={passwordField}
                    onChangeText={t => setPasswordField(t)} password={true} />

                <CustomButton onPress={handlerSaveButtonClick}>
                    <CustomButtonText>CADASTRAR</CustomButtonText>
                </CustomButton>
            </InputArea>

            <SignMessageButton onPress={handlerLoginButtonClick}>
                <SignMessageButtonText>Já possui uma conta?</SignMessageButtonText>
                <SignMessageButtonTextBold>Faça o login</SignMessageButtonTextBold>
            </SignMessageButton>
        </Container>
    );
}