import React, { useState, useEffect } from 'react';
import { Platform, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import Api from '../../Api';
import BarbersItem from '../../components/BarbersItem';

import {
    Container,
    Scroller,
    HeaderArea,
    HeaderTitle,
    SearchButton,
    LocationArea,
    LocationInput,
    LocationFinder,
    LoadingIcon,
    ListArea
} from './styles';

import SearchIcon from '../../assets/search.svg';
import MyLocationIcon from '../../assets/my_location.svg';

export default () => {

    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [locationText, setLocationText] = useState('');
    const [listBarbers, setListBarbers] = useState([]);
    const [coords, setCoords] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const handleLocationFinder = async () => {
        setCoords(null);
        let result = await request(
            Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        );

        if (result === 'granted') {
            setLoading(true);
            setLocationText('');
            setListBarbers([]);

            Geolocation.getCurrentPosition((info) => {
                setCoords(info.coords);
                getBarbers();
            })
        }
    }

    const getBarbers = async () => {
        setLoading(true);
        setListBarbers([]);

        let lat = null;
        let lng = null;

        if (coords) {
            lat = coords.latitude;
            lng = coords.longiturde;
        }

        let resp = await Api.getBarbers(lat, lng, locationText);
        if (resp.error == '') {
            if (resp.loc) {
                setLocationText(resp.loc)
            }
            setListBarbers(resp.data)
        } else {
            alert("Erro: ", resp.error)
        }

        setLoading(false);
    }

    useEffect(() => {
        getBarbers();
    }, [])

    const onRefresh = () => {
        setRefreshing(false);
        getBarbers();
    }

    const handleLocationSearch = () => {
        setCoords({});
        getBarbers();
    }

    return (
        <Container>
            <Scroller refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <HeaderArea>
                    <HeaderTitle>Encontre o seu barbeiro favorito</HeaderTitle>
                    <SearchButton onPress={() => navigation.navigate('Search')}>
                        <SearchIcon width="24" height="24" fill="#FFF" />
                    </SearchButton>
                </HeaderArea>

                <LocationArea>
                    <LocationInput
                        placeholder="Onde você está?"
                        placeholderTextColor="#FFF"
                        value={locationText}
                        onChangeText={t => setLocationText(t)}
                        onEndEditing={handleLocationSearch}
                    />
                    <LocationFinder onPress={handleLocationFinder}>
                        <MyLocationIcon width="24" height="24" fill="#FFF" />
                    </LocationFinder>
                </LocationArea>


                {loading &&
                    <LoadingIcon size="large" color="#FFF" />
                }

                <ListArea>
                    {listBarbers.map((item, key) => (
                        <BarbersItem key={key} data={item} />
                    ))}
                </ListArea>
            </Scroller>
        </Container>
    );
}