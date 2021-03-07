import * as React from 'react';
import { View, Text, Alert, } from 'react-native';
import { useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import { useIsFocused } from '@react-navigation/native';

var db = openDatabase({
    name: 'medic',
    createFromLocation: '~www/medic.db',
    });

function MedicamentCase({ navigation, tableau }) {
    let newDate = new Date()
    const [jour, setJour] = useState(("0" + (newDate.getDate())).slice(-2))
    const [mois, setMois] = useState(("0" + (newDate.getMonth() + 1)).slice(-2))
    const [annee, setAnnee] = useState((newDate.getFullYear()))
    const [time, setTime] = useState(0)
    const [tableauMedic, setTableauMedic] = useState([]);
    const tableauDeMedicament = [];
    const derniereprise = [];
    const heure = [];
    const [onclick, setOnclick] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_medic a LEFT JOIN (SELECT *,max(prise_id) from table_prise GROUP by  prise_medicid ) b on a.medic_id= b.prise_medicid', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                    temp.push(results.rows.item(i));
                setTableauMedic(temp);
            });
        });
    }, [onclick, isFocused]);

    function ajouterUnePrise(id) {
        setJour(("0" + (newDate.getDate())).slice(-2))
        setMois(("0" + (newDate.getMonth() + 1)).slice(-2))
        setAnnee((newDate.getFullYear()))
        setTime(newDate.valueOf())
        id = id + 1;
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO table_prise (prise_medicid,prise_time,prise_jour,prise_mois,prise_annee) VALUES (?,?,?,?,?)', [id, time, jour, mois, annee], (tx, results) => {
            },
            );
        });
    }

    function verifDernierePrise(id) {
        setOnclick(!onclick);
        var diff = newDate - derniereprise[id];
        const diffHours = diff / (1000 * 60 * 60);
        if ((parseInt(diffHours) >= heure[id]) || (heure[id] == null)) {
            ajouterUnePrise(id);
        } else {
            Alert.alert(
                //title
                'Attention le temps prescrit est de :',
                //body
                heure[id] + ' heures',
                [
                    {
                        text: 'ok',
                    },
                ],
                { cancelable: true },
            );
        }
        RetourneDernierePrise(id)
    }

    function RetourneDernierePrise(index) {
        var diff = newDate - tableauMedic[index].prise_time;
        if (parseInt(diff / (1000 * 60 * 60)) === 0) {
            return (parseInt(diff / (1000 * 60)) + ' Minutes')
        } else if ((diff / (1000 * 60)) < 60) {
            return (parseInt(diff / (1000 * 60 * 60)) + ' Heures')
        } else if (parseInt(diff / (1000 * 60 * 60 * 24)) > 365) {
            return ('')
        } else {
            return (parseInt(diff / (1000 * 60 * 60 * 24)) + ' Jours')
        }
    }


    for (let index = 0; index < tableauMedic.length; index++) {
        tableauDeMedicament.push(
            <TouchableOpacity onLongPress={() => { navigation.navigate('Calendar', { titre: tableauMedic[index].medic_name, id: tableauMedic[index].medic_id }) }} onPress={() => { verifDernierePrise(index) }} >
                <View style={{ borderWidth: 2, borderRadius: 20, height: 100, width: 100, alignItems: 'center', justifyContent: 'center', margin: 5 }}>
                    <Text style={{ fontSize: 15 }}>{tableauMedic[index].medic_name}</Text>
                    <Text style={{ fontSize: 15 }}>{RetourneDernierePrise(index)}</Text>
                </View>
            </TouchableOpacity>
        )
        derniereprise.push(tableauMedic[index].prise_time)
        heure.push(tableauMedic[index].medic_heure)
    }
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {tableauDeMedicament}
        </View>
    );
}

export default MedicamentCase