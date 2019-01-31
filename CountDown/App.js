import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput,ListView, Button, DatePickerAndroid, ProgressBarAndroid, ScrollView, RefreshControl } from 'react-native';

export default class App extends Component {
  constructor(props)
  {
      super(props);
      const tmpds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      this.state = {
        text : "",
        ds: tmpds,
        startingDate : new Date,
        endingDate : new Date,
        allCountDown : [],
        Countdowns: tmpds.cloneWithRows([]),
      }
  }

  SetStartingDate = async() =>
  {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        startingDate : new Date(year, month, day),
      });
      this.setState({startingDate : new Date(year, month, day)});
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
    console.log(this.state);
  }

  SetEndingDate = async() =>
  {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        endingDate : new Date(year, month, day),
      });
      this.setState({endingDate : new Date(year, month, day)});
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
    console.log(this.state);
  }

  addCountDown()
  {
    var temp = this.state.allCountDown;
    var id = 0;
    if (temp.length)
    {
      id = temp[temp.length-1].id + 1;
    }
    temp.push({id, startingDate : this.state.startingDate, endingDate : this.state.endingDate, text : this.state.text});


    this.setState({text : "", Countdowns: this.state.ds.cloneWithRows(temp), allCountDown : temp, startingDate : new Date, endingDate : new Date});
  }

  progressBarCalcul(start, end)
  {
    var diffMsEnv = Math.abs((end.getTime() - start.getTime()));

    var today = new Date;
    var diffMsNow = Math.abs((today.getTime() - start.getTime()));

    var result = ((((100 * diffMsNow) / diffMsEnv)).toPrecision(1))/100;

    return result;
  }

  deleteElement(id)
  {
    console.log(id);
    let tmp = this.state.allCountDown;
    tmp = tmp.filter(item => {
      return item.id !== id
    })
    console.log(tmp);
    this.setState({ allCountDown: tmp, Countdowns: this.state.ds.cloneWithRows(tmp)})
  }


  render() {
    const { allCountDown } = this.state;
    return (
      <View style={styles.container}>
          <ScrollView style={styles.show}>
          <ListView
            dataSource={this.state.Countdowns}
            enableEmptySections={true}
            renderRow={(element) => {
              return (
                <View>
                  <Text>{element.text}</Text>
                  <Text>Start date : {element.startingDate.getDate().toString()}/{(element.startingDate.getUTCMonth() + 1).toString()}/{element.startingDate.getFullYear().toString()}</Text>
                  <Text>End date : {element.endingDate.getDate().toString()}/{(element.endingDate.getUTCMonth() + 1).toString()}/{element.endingDate.getFullYear().toString()}</Text>
                  <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={this.progressBarCalcul(element.startingDate, element.endingDate)} />
                  <Button title="Supprimer" onPress={() => this.deleteElement(element.id)}></Button>
                </View>
              )
            }} />
          </ScrollView>

          <View style={styles.add}>
            <Text>Ajouter un compte à rebour :</Text>
            <Text>Libellé :</Text>
            <TextInput
            style={{borderColor: 'gray', borderWidth: 1, width:240}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            />

            <Text>Date de début :</Text>
            <Text>{this.state.startingDate.getDate().toString()}/{(this.state.startingDate.getUTCMonth() + 1).toString()}/{this.state.startingDate.getFullYear().toString()}</Text>
            <Button title="SetDate" onPress={this.SetStartingDate}></Button>


            <Text>Date de fin :</Text>
            <Text>{this.state.endingDate.getDate().toString()}/{(this.state.endingDate.getUTCMonth() + 1).toString()}/{this.state.endingDate.getFullYear().toString()}</Text>
            <Button title="SetDate" onPress={this.SetEndingDate}></Button>
            
          <Button title="Validate" color="#930d1d" style={styles.validateButton} onPress={() => this.addCountDown()}>
            
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  add : {
    borderColor: 'gray',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width : 500
  },
  validateButton : {
    width : '100%',
  },
  show : {
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%'
  }
});
