import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/Ionicons';


var db = openDatabase({
    name: 'medic',
    createFromLocation: '~www/medic.db',
    });

function Calendar({ navigation, route }) {
    const [anneeChoisi, setAnneeChoisi] = useState('2021')
    const [tableau, setTableau] = useState([])
   
    useEffect(() => {
        const focus = navigation.addListener('focus', () => {
            recuperationDonnee()
        });
        return focus;
    }, []);
    
    function recuperationDonnee()
    {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_prise where prise_annee=(?) AND prise_medicid=(?)', [anneeChoisi,route.params.id], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                    temp.push(results.rows.item(i));
                setTableau(temp);
            });
        });
    }
    function afficherAllday() {
        const tab = []
        for (let index = 0; index < tableau.length; index++) {
            tab.push(
                <View style={{ flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center', margin: 5 }}>
                    <Text style={{ fontSize: 15 }}>
                        {tableau[index].prise_jour}-
                        {tableau[index].prise_mois}-
                        {tableau[index].prise_annee}
                    </Text >
                </View>
            )
        }
        setTableau[tab]
        return tab;
    }
    return (
        <>
            <View style={{ backgroundColor: '#74B72E', height: 100, width: '100%', paddingTop: 50, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-back-outline" style={{ fontSize: 30, color: 'white', marginRight: '33%' ,marginLeft:10  }} /></TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 20 ,marginLeft:-10}}>Calendrier</Text>
            </View>
            <View style={{ backgroundColor: '#00804F', alignItems: 'center', marginTop: 30 }}>
                <TextInput
                    style={{ height: 40, color: 'white' }}
                    keyboardType='numeric'
                    onChangeText={anneeChoisi => setAnneeChoisi(anneeChoisi)}
                    onChange={recuperationDonnee()}
                    value={anneeChoisi}
                />
            </View>
            <ScrollView>
                <View style={{ alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ fontSize: 25 }}>{route.params.titre}</Text>
                </View>
                {/* <Icon name="save-outline" style={{ fontSize: 30, color: '#B2B2B2',marginLeft:'90%' }} /> */}
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    {afficherAllday()}
                </View>

            </ScrollView>
        </>
    );
}

export default Calendar