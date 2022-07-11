import {Component} from 'react';
import {Layout} from 'antd';
import {Row, Col} from 'antd';
import Map from 'react-map-gl';
// custom components
import NavBar from './components/nav';
import ModelConfigPanel from './components/modelConfig';
// import css style files
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/App.css';

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
      model_trained: false,
      spatial_kernel: "adaptive_bisquare",
      model_type: "Gaussian",
      local_modal: "GWR",
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
              style={{width: '100vw', height: '96.5vh'}}
              mapStyle="mapbox://styles/mapbox/light-v10"
              mapboxAccessToken={MAPBOX_TOKEN}
            />
            
            <ModelConfigPanel
              model_trained={this.state.model_trained}
              spatial_kernel={this.state.spatial_kernel}
              model_type={this.state.model_type}
              local_modal={this.state.local_modal}
            />

          </Content>
        </Layout>
      </div>
    );
  }
  
}

export default App;
