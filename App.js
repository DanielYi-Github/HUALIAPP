import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import SplashScreen           from 'react-native-splash-screen';


const NUM_ITEMS = 100;
function getColor(i: number) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

type Item = {
  key: string,
  label: string,
  height: number,
  width: number,
  backgroundColor: string, 
};

const initialData: Item[] = [...Array(NUM_ITEMS)].map((d, index) => {
  const backgroundColor = getColor(index);
  return {
    key: `item-${index}`,
    label: `${index}`,
    height: 100,
    width: 60 + Math.random() * 40,
    backgroundColor,
  };
});

export default function App() {
  SplashScreen.hide();
  const [data, setData] = useState(initialData);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.rowItem,
            { backgroundColor: isActive ? 'red' : item.backgroundColor },
          ]}
          onLongPress={drag}>
          <Text style={styles.text}>{item.label}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => setData(data)}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      autoscrollSpeed={Platform.OS === "android"? 10 : 100}
    />
  );
}

const styles = StyleSheet.create({
  rowItem: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
//   Button,
//   Alert,
//   Platform,
// } from 'react-native';
// import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
// import SplashScreen           from 'react-native-splash-screen';
// import RNCalendarEvents from 'react-native-calendar-events';

// class App extends React.Component {

//     componentDidMount(){
//         SplashScreen.hide();
//     };

//     render() {
//       return (
//         <View>
//           <StatusBar barStyle="dark-content" />
//           <SafeAreaView>
//             <ScrollView
//               contentInsetAdjustmentBehavior="automatic"
//               style={styles.scrollView}>
//               <Header />
//               {global.HermesInternal == null ? null : (
//                 <View style={styles.engine}>
//                   <Text style={styles.footer}>Engine: Hermes</Text>
//                 </View>
//               )}
//               <View style={styles.body}>
//                 <View style={styles.sectionContainer}>
//                   <Text style={styles.sectionTitle}>Read/Write Auth</Text>
//                   <Text style={styles.sectionDescription}>
//                     <Button
//                       title="Request auth"
//                       onPress={() => {
//                         RNCalendarEvents.requestPermissions().then(
//                           (result) => {
//                             Alert.alert('Auth requested', result);
//                           },
//                           (result) => {
//                             console.error(result);
//                           },
//                         );
//                       }}
//                     />
//                     <Text>{'\n'}</Text>
//                     <Button
//                       title="Check auth"
//                       onPress={() => {
//                         RNCalendarEvents.checkPermissions().then(
//                           (result) => {
//                             Alert.alert('Auth check', result);
//                           },
//                           (result) => {
//                             console.error(result);
//                           },
//                         );
//                       }}
//                     />
//                   </Text>
//                 </View>
//                 {Platform.OS === 'android' && (
//                   <View style={styles.sectionContainer}>
//                     <Text style={styles.sectionTitle}>Read-Only Auth</Text>
//                     <Text style={styles.sectionDescription}>
//                       <Button
//                         title="Request auth"
//                         onPress={() => {
//                           RNCalendarEvents.requestPermissions(true).then(
//                             (result) => {
//                               Alert.alert('Read-only Auth requested', result);
//                             },
//                             (result) => {
//                               console.error(result);
//                             },
//                           );
//                         }}
//                       />
//                       <Text>{'\n'}</Text>
//                       <Button
//                         title="Check auth"
//                         onPress={() => {
//                           RNCalendarEvents.checkPermissions(true).then(
//                             (result) => {
//                               Alert.alert('Read-only Auth check', result);
//                             },
//                             (result) => {
//                               console.error(result);
//                             },
//                           );
//                         }}
//                       />
//                     </Text>
//                   </View>
//                 )}
//                 <View style={styles.sectionContainer}>
//                   <Text style={styles.sectionTitle}>Calendars</Text>
//                   <Text style={styles.sectionDescription}>
//                     <Button
//                       title="Find calendars"
//                       onPress={() => {
//                         RNCalendarEvents.findCalendars().then(
//                           (result) => {
//                             Alert.alert(
//                               'Calendars',
//                               result
//                                 .reduce((acc, cal) => {
//                                   acc.push(cal.title);
//                                   return acc;
//                                 }, [])
//                                 .join('\n'),
//                             );
//                           },
//                           (result) => {
//                             console.error(result);
//                           },
//                         );
//                       }}
//                     />
//                   </Text>
//                 </View>
//               </View>
//             </ScrollView>
//           </SafeAreaView>
//         </View>
//       )
//     };
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

// export default App;
