import {Component} from 'react';
import './styles/App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Layout} from 'antd';
import {Row, Col} from 'antd';
import Map from 'react-map-gl';
import NavBar from './components/nav';

/** import data */ 
//import {DATA_NAME} from "./resource/data_example";

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FubWlzYW4iLCJhIjoiY2sxOWxqajdjMDB2ZzNpcGR5aW13MDYzcyJ9.WsMnhXizk5z3P2C351yBZQ'; // Set your mapbox token here

class App extends Component {
  constructor(props) {
    super(props);
    /** Initialize the data
     * TODO: Modify the state initial with a more flexible way
     */
    this.state = {
      example_state1: 'hello world',
    };
  }

  /** handle component activities -- only an example */
  handleStateChange = (selectedScenario) => {
    this.setState({selectedScenario});
  };


  render() {
    //console.log(this.state); 
    
    const { Header, Content } = Layout;
    
    return (
      <div className="App">
        <Layout className="mainContainer">
          <Header className="headContainer">
            <NavBar />
          </Header>
          <Content className="vastContainer">
            {/**
             * Main layout of the systemx
             */}
            <Map
              initialViewState={{
                latitude: 40,
                longitude: -100,
                zoom: 3
              }}
              style={{width: '100vw', height: '90vh'}}
              mapStyle="mapbox://styles/mapbox/light-v9"
              mapboxAccessToken={MAPBOX_TOKEN}
            />
             

          </Content>
        </Layout>
      </div>
    );
  }
  
}

export default App;
