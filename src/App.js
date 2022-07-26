import {Component} from 'react';
import {Layout} from 'antd';
import {Row, Col} from 'antd';
import Map, { Source, Layer } from 'react-map-gl';
import axios from 'axios';

// custom components
import NavBar from './components/nav';
import ModelConfigPanel from './components/modelConfig';

// import css style files
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/App.css';

// import utilities
import { getCountyCenter, getConfigMapLayerY, addBivariateProp, getConfigMapLayerYX } from './utilities';
import { SortableItem } from './utilities/sortableItem';

/** import data */ 
//import {DATA_NAME} from "./resource/data_example";
import georgia_demo from './data/georgia_demo.json';
import chicago_demo from './data/chicago_config_poly.json';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FubWlzYW4iLCJhIjoiY2sxOWxqajdjMDB2ZzNpcGR5aW13MDYzcyJ9.WsMnhXizk5z3P2C351yBZQ'; // Set your mapbox token here
const ignore_properties = ['county_name', 'state_name', 'UID', 'Long_', 'Lat', 'ID', 'name'];

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
      data_properties: [],
      original_features:[],
      dependent_features: [],
      independent_features: [],
      //original_feature_sortable: [],
      //dependent_sortable: [],
      //independent_sortable: [],
      viewState:{
        latitude: 40,
        longitude: -100,
        zoom: 3
      },
      NWSE_bounds: null,
      config_layer: {
        id: 'config-fill',
        type: 'fill',
        layout: {
          'visibility': 'none',
        },
      },
      norm_test_result: [],

      // background layer
      default_fill_layer: {
        id: 'counties-fill',
        type: 'fill',
        paint: {
          'fill-color': 'rgba(0,0,0,0.1)'
        }
      },
      default_stroke_layer: {
        id: 'counties-stroke',
        type: 'line',
        paint: {
          'line-color': 'rgba(0,0,0,0.1)',
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

  getNormalityTestResult = (featureList, select_case) => {
    axios.get('/models/api/v0.1/calibration/normality/'+featureList+'+'+select_case)
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  };

  // NAV BAR CONTROLLERS
  handleCaseSelectionChange = (val) => {
    this.setState({select_case: val});
  };

  handleLoadData = () => {
    // TODO: Add us-election case
    if(this.state.select_case === 'georgia'){
      let map_coords = getCountyCenter(georgia_demo);
      let global_data_properties_list = [];
      Object.keys(georgia_demo.features[0].properties).forEach((e,i)=>{
        if(ignore_properties.indexOf(e) === -1) global_data_properties_list.push(e);
      });

      //get normality test result
      this.getNormalityTestResult(global_data_properties_list, this.state.select_case);

      let viewState = {
        latitude: map_coords.center_coords[1],
        longitude: map_coords.center_coords[0],
        zoom: 6
      };

      let config_layer = {
        id: 'config-fill',
        type: 'fill',
        layout: {
          'visibility': 'none',
        },
      };

      this.setState({
        loaded_map_data: georgia_demo,
        data_properties: global_data_properties_list,
        original_features: global_data_properties_list,
        dependent_features: [],
        independent_features: [],
        //original_feature_sortable: this.updateSortableItems('original', global_data_properties_list),
        viewState: viewState,
        NWSE_bounds: map_coords.NWSE_bounds,
        config_layer: config_layer,
        //norm_test_result: 
      });
    }else{
      let map_coords = getCountyCenter(chicago_demo);
      let global_data_properties_list = [];
      Object.keys(chicago_demo.features[0].properties).forEach((e,i)=>{
        if(ignore_properties.indexOf(e) === -1) global_data_properties_list.push(e);
      });

      let viewState = {
        latitude: map_coords.center_coords[1],
        longitude: map_coords.center_coords[0],
        zoom: 10
      };

      let config_layer = {
        id: 'config-fill',
        type: 'fill',
        layout: {
          'visibility': 'none',
        },
      };
      this.setState({
        loaded_map_data: chicago_demo,
        data_properties: global_data_properties_list,
        original_features: global_data_properties_list,
        dependent_features: [],
        independent_features: [],
        //original_feature_sortable: this.updateSortableItems('original', global_data_properties_list),
        viewState: viewState,
        NWSE_bounds: map_coords.NWSE_bounds,
        config_layer: config_layer,
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

  /** Deprecated */
  updateSortableItems = (varType, items) => {
    const sortableItems = [];
    let key_prefix = '';
    if(varType === "original"){
      key_prefix = 'Original_';
      items.forEach((e,i)=>{sortableItems.push(<SortableItem key={key_prefix+i} content={e} />)});
      //this.setState({original_feature_sortable: sortableItems});
      return sortableItems;
    }  
  };

  // update sortable list
  updateSortableList = (varType, newList) => {
    if(varType === 'original'){
      this.setState({original_features: newList});
    }else if(varType === 'dependent'){
      let configLayer = getConfigMapLayerY(newList, this.state.loaded_map_data);
      //console.log(configLayer);
      this.setState({
        dependent_features: newList,
        config_layer: configLayer
      });
    }else{ // independent list
      //if(newList.length > 0){
      //  let geoData = addBivariateProp(newList, this.state.loaded_map_data);
      //  this.setState({loaded_map_data: geoData});
      //  let configLayer = getConfigMapLayerYX();
      //  this.setState({config_layer: configLayer});
      //}
      this.setState({
        independent_features: newList
      });
    }
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
    if(this.state.dependent_features.length > 0 && this.state.independent_features.length > 0){
      let newList = [this.state.dependent_features[0], this.state.independent_features[0]];
      addBivariateProp(newList, this.state.loaded_map_data);
    }
    
    const { Header, Content } = Layout;

    const selectedUID = (this.state.hoverInfo && this.state.hoverInfo.UID) || '';
    const hoverfilter = ['in', 'UID', selectedUID];

    const default_source_layers = 
      this.state.loaded_map_data === null ? <></> :
      <Source id='default_layer_source' type='geojson' data={this.state.loaded_map_data}>
        <Layer beforeId="waterway-label" {...this.state.default_fill_layer} />
        <Layer beforeId='waterway-label' {...this.state.config_layer} />
        <Layer beforeId="waterway-label" {...this.state.default_stroke_layer} />
        <Layer beforeId="waterway-label" {...this.state.hover_border_layer} filter={hoverfilter} />
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
              projection={'globe'}
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

              // variavle selection panels
              //dependentSortableItems={this.state.dependent_sortable}
              //independentSortableItems={this.state.independent_sortable}
              //originalSortableItems={this.state.original_feature_sortable}
              original_features={this.state.original_features}
              dependent_features={this.state.dependent_features}
              independent_features={this.state.independent_features}
              updateSortableList={this.updateSortableList}
            />

          </Content>
        </Layout>
      </div>
    );
  }
  
}

export default App;
