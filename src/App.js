import {Component} from 'react';
import {Layout} from 'antd';
import {Row, Col} from 'antd';
import Map, { Source, Layer } from 'react-map-gl';
// custom components
import NavBar from './components/nav';
import ModelConfigPanel from './components/modelConfig';

// import css style files
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/App.css';

// import utilities
import { getCountyCenter } from './utilities';

/** import data */ 
//import {DATA_NAME} from "./resource/data_example";
import georgia_demo from './data/georgia_demo.json';
import chicago_demo from './data/chicago_config_poly.json';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FubWlzYW4iLCJhIjoiY2sxOWxqajdjMDB2ZzNpcGR5aW13MDYzcyJ9.WsMnhXizk5z3P2C351yBZQ'; // Set your mapbox token here

class App extends Component {
  constructor(props) {
    super(props);
    /** Initialize the data
     * TODO: Modify the state initial with a more flexible way
     */
    this.state = {
      // model config states
      model_trained: false,
      spatial_kernel: "adaptive bisquare",
      model_type: "gaussian",
      local_modal: "gwr",
      // selected case
      select_case: 'georgia',
      loaded_map_data: null,
      viewState:{
        latitude: 40,
        longitude: -100,
        zoom: 3
      },
      NWSE_bounds: null,
      // background layer
      default_fill_layer: {
        id: 'counties-fill',
        type: 'fill',
        paint: {
          'fill-outline-color': 'rgba(0,0,0,0.1)',
          'fill-color': 'rgba(0,0,0,0.1)'
        }
      },
      hover_border_layer: {
        id: 'borders',
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#FFFFFF'
        },
      },
      hoverInfo:null,
      // saved config session
      saved_config_session: {},
    };
  }

  // NAV BAR CONTROLLERS
  handleCaseSelectionChange = (val) => {
    this.setState({select_case: val});
  };

  handleLoadData = () => {
    // TODO: Add us-election case
    if(this.state.select_case === 'georgia'){
      let map_coords = getCountyCenter(georgia_demo);
      let viewState = {
        latitude: map_coords.center_coords[1],
        longitude: map_coords.center_coords[0],
        zoom: 6
      };
      this.setState({
        loaded_map_data: georgia_demo,
        viewState: viewState,
        NWSE_bounds: map_coords.NWSE_bounds
      });
    }else{
      let map_coords = getCountyCenter(chicago_demo);
      let viewState = {
        latitude: map_coords.center_coords[1],
        longitude: map_coords.center_coords[0],
        zoom: 10
      };
      this.setState({
        loaded_map_data: chicago_demo,
        viewState: viewState,
        NWSE_bounds: map_coords.NWSE_bounds
      });
    }
  };

  // Model Config options
  handleModelKernel = (val) => {
    this.setState({spatial_kernel: val});
  };
  handleModelType = (val) => {
    this.setState({model_type: val});
  };
  handleLocalModel = (val) => {
    this.setState({local_modal: val});
  };

  //MAIN APP Controllers
  onHover = (event) => {
    let feature = event.features && event.features[0];
    let hoverInfo = {
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      UID: feature && feature.properties.UID
    };
    this.setState({hoverInfo: hoverInfo});
  };

  render() {
    //console.log(this.state); 
    
    const { Header, Content } = Layout;

    const selectedUID = (this.state.hoverInfo && this.state.hoverInfo.UID) || '';
    const filter = ['in', 'UID', selectedUID];
    const default_source_layers = 
      this.state.loaded_map_data === null ? <></> :
      <Source id='default_layer_source' type='geojson' data={this.state.loaded_map_data}>
        <Layer beforeId="waterway-label" {...this.state.default_fill_layer} />
        <Layer beforeId="waterway-label" {...this.state.hover_border_layer} filter={filter} />
      </Source>;
    
    return (
      <div className="App">
        <Layout className="mainContainer">
          <Header className="headContainer">
            <NavBar
              select_case={this.state.select_case}
              handleCaseSelectionChange={this.handleCaseSelectionChange}
              handleLoadData={this.handleLoadData}
            />
          </Header>
          <Content className="vastContainer">
            {/**
             * Main layout of the systemx
             */}
            <Map
              {...this.state.viewState}
              onMove={evt => this.setState({viewState: evt.viewState})}
              style={{width: '100vw', height: '96.5vh'}}
              mapStyle="mapbox://styles/mapbox/light-v10"
              minZoom={2}
              attributionControl={false}
              mapboxAccessToken={MAPBOX_TOKEN}
              onMouseMove={this.onHover}
              interactiveLayerIds={this.state.loaded_map_data === null ? [] : ['counties-fill']}
            >
              {default_source_layers}
            </Map>
            
            <ModelConfigPanel
              model_trained={this.state.model_trained}
              spatial_kernel={this.state.spatial_kernel}
              model_type={this.state.model_type}
              local_modal={this.state.local_modal}

              handleModelKernel={this.handleModelKernel}
              handleModelType={this.handleModelType}
              handleLocalModel={this.handleLocalModel}
            />

          </Content>
        </Layout>
      </div>
    );
  }
  
}

export default App;
