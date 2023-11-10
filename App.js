import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
const screen_width = Dimensions.get("window").width;
const API_KEY = "7bdd7dad75d39879712753e4effb33ef";

const icons = {
  Clouds: "cloudy",
  Clear : "day-sunny",
  Atmosphere :"",
  snow : "snowflake",
  Rain : "rain",
  Thunderstorm : "lightning"

};

export default function App() {
  const [city, setCity] = useState("Loading..");
  const [days, setDays] = useState([]);
  const [ok, setOK] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOK(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );

    const json = await response.json();
    

    setDays(
      json.list.filter((weather) => {
        if (weather.dt_txt.includes("03:00:00")) {
          return weather;
        }
      })
    );
   
  };
  useEffect(() => {
    getWeather();
  }, []);
  const extractDate = (dt_txt) => {
    const date = new Date(dt_txt);
    return `${date.getMonth() + 1}.${date.getDate()-1}`;
  };
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        indicatorStyle="white"
        npx
        expo
        install
        expo-location
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator style ={{alignItems : 'center', marginTop : 10}}
              color="white"
              size="large"
              
            />
          </View>
        ) : ( 
          days.map((day, index) => (
             
            <View key={index} style={styles.day}>
              <Text style={{...styles.day, fontSize : 50, fontWeight : 'bold',marginLeft :140, color : 'white'}}>{extractDate(day.dt_txt)}</Text>
              <View style = {{flexDirection : 'row', alignItems : 'center', width :"100%", justifyContent : "space-between"}}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                
                <Fontisto name={icons[day.weather[0].main]} size={60} color="black" margin style ={{marginTop : 80, marginRight : 50}}  />

              </View>
              
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "skyblue",
  },
  city: {
    flex: 1,
    marginTop: 20,

    alignItems: "center",
    justifyContent: "center",
  },
  cityName: {
    fontWeight: 500,
    fontSize: 58,
  },
  day: {
    width: screen_width,

    justifyContent : "flex-start",
    
  },
  temp: {
    marginTop: 50,
    fontSize: 120,
    fontWeight: 500,
    marginLeft : 50
  },
  description: {

    marginTop: -30,
    fontSize: 40,
    marginLeft : 51
  },
  tinyText: {
    
    fontSize: 15,
    marginLeft : 55
  },
});
