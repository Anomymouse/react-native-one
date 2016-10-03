/**
 * Created by erfli on 10/2/16.
 */
import * as React from "react";
import {
    Text,
    View,
    Image,
    ListView,
    BackAndroid,
    TouchableHighlight,
    Dimensions,
    StyleSheet
} from 'react-native';
import ViewPager from 'react-native-viewpager';
import  {apiURL} from "../../Utilities/UrlCons";
import {Actions} from 'react-native-router-flux'
/**
 * Created by erfli on 9/10/16.
 */
class OneRead extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) =>r1 !== r2
        });
        var bannerDataSource = new ViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2,
        });

        this.state = {
            banners: bannerDataSource.cloneWithPages([]),
            essays: ds.cloneWithRows([])
        }
    }


    componentDidMount() {
        this.fetchDaily();
        BackAndroid.addEventListener('hardwareBackPress', this.goBack);
    }


    fetchDaily() {
        var bannerUrl = apiURL.baseUrl + apiURL.readingCarousel;
        var essayUrl = apiURL.baseUrl + apiURL.readingIndex;
        fetch(bannerUrl)
            .then((response)=>response.json())
            .then((jsonResponse) => {
                if (jsonResponse["data"]) {
                    var banners = jsonResponse["data"];
                    this.setState({
                        banners: this.state.banners.cloneWithPages(banners)
                    });
                }
            }).catch((error) => {

            if (error instanceof SyntaxError) {
                alert("SyntaxError error");
            }
        });
        fetch(essayUrl)
            .then((response)=>response.json())
            .then((jsonResponse) => {
                if (jsonResponse["data"]) {
                    var essays = jsonResponse["data"].essay;
                    this.setState({
                        essays: this.state.essays.cloneWithRows(essays)
                    });
                }
            }).catch((error) => {

            if (error instanceof SyntaxError) {
                alert("SyntaxError error");
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.viewpage}>
                    <ViewPager
                        dataSource={this.state.banners}
                        renderPage={this.renderBanners}
                        isLoop={true}
                        autoPlay={true}
                    />
                </View>
                <ListView
                    style={styles.listview}
                    dataSource={this.state.essays}
                    renderRow={(rowData, sectionID, rowID)=>
                        <TouchableHighlight
                            key={rowData.content_id}
                            activeOpacity={0.5}
                            onPress={()=>Actions.ReadingDetail({id: rowData.content_id})}
                        >
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                marginTop: 10,
                                marginLeft: 15,
                                marginRight: 15
                            }}>
                                <Text style={{fontSize: 12, marginTop: 10}}>{rowData.hp_title}</Text>
                                <Text style={{fontSize: 8}}>{rowData.author.user_name}</Text>
                                <Text style={{fontSize: 8, marginBottom: 20}}>{rowData.guide_word}</Text>
                                <View style={styles.divider}></View>
                            </View>
                        </TouchableHighlight>

                    }
                />
            </View>
        );
    }

    renderBanners(data, pageID) {
        return (
            <Image style={{
                height: 140,
                width: deviceWidth,
            }} source={{url: data.cover}}>
                <View style={{width: deviceWidth, height: 140, flexDirection: 'column'}}>
                    <Text style={{
                        fontSize: 10,
                        marginTop: 110,
                        marginLeft: 20,
                    }}>{data.bottom_text}</Text>
                </View>

            </Image>
        );
    }
}
var deviceWidth = Dimensions.get('window').width;
var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
        flexDirection: 'column'
    },
    viewpage: {
        height: 140,
        width: deviceWidth,
        backgroundColor: '#F5FCFF',
    },
    listview: {
        flex: 1,
        backgroundColor: '#FCFCFC',
        marginTop: 5
    },
    divider: {
        height: 0.5,
        backgroundColor: '#139'
    }
});

module.exports = OneRead;