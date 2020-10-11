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

import Api from '../../Api';

import SignInput from '../../components/SignInput';

import BarberIcon from '../../assets/barber.svg';
import EmailIcon from '../../assets/email.svg';
import LockIcon from '../../assets/lock.svg';

export default () => {

    const { dispatch: UserDispatch } = useContext(UserContext);

    const navigation = useNavigation();

    const [emailField, setEmailField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const handlerMessageButtonClick = () => {
        navigation.reset({
            routes: [{ name: 'SignUp' }]
        });
    }

    const handlerSignButtonClick = async () => {
        if (emailField != '' && passwordField != '') {
            let res = await Api.signIn(emailField, passwordField);

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
            } else {
                alert("Email e/ou senha errados!")
            }
        } else {
            alert("Preencha os campos!")
        }
    }

    return (
        <Container>
            <BarberIcon width="100%" height="160" />

            <InputArea >
                <SignInput IconSvg={EmailIcon} placeholder="Digite seu e-mail" value={emailField}
                    onChangeText={t => setEmailField(t)} />

                <SignInput IconSvg={LockIcon} placeholder="Digite sua senha" value={passwordField}
                    onChangeText={t => setPasswordField(t)} password={true} />

                <CustomButton onPress={handlerSignButtonClick}>
                    <CustomButtonText>LOGIN</CustomButtonText>
                </CustomButton>
            </InputArea>

            <SignMessageButton onPress={handlerMessageButtonClick}>
                <SignMessageButtonText>Ainda não possui uma conta?</SignMessageButtonText>
                <SignMessageButtonTextBold>Cadastre-se</SignMessageButtonTextBold>
            </SignMessageButton>

        </Container>
    );
}