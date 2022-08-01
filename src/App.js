import {Component, cloneElement} from 'react';
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
      sortable_components: {},
      
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
      VIF_test_result: {},

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
    axios.get('http://localhost:5005/models/api/v0.1/calibration/normality/'+featureList+'+'+select_case)
    .then(response => {
      //console.log(response);
      const featureDict = this.updateSortableComponents('normTest', response.data.normality_results);
      // update states
      this.setState({
        norm_test_result: response.data.normality_results,
        sortable_components: featureDict
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  };

  getVIF = (featureList, select_case) => {
    axios.get('http://localhost:5005/models/api/v0.1/calibration/VIF/'+featureList+'+'+select_case)
    .then(response => {
      const vifList = response.data.VIF_results.VIF_list;
      const vifDict = {};
      featureList.forEach((e,i)=>{
        vifDict[e] = vifList[i];
      });
      const featureDict = this.updateSortableComponents('VIF', vifDict);
      // update states
      this.setState({
        VIF_test_result: vifDict,
        sortable_components: featureDict
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  };

  // prerender all sortable items in model config interface
  renderSortableComponents = (featureList) => {
    let featureDict = {
      activ: {},
      origin: {}
    };
    featureList.forEach(e=>{
      let sortableItem = 
      <SortableItem
          key={e} id={e} content={e} active={false} 
          container={'original'}
          norm_test_result={[]}
          VIFresult={null}
      />
      let sortableItemActiv = 
      <SortableItem
          key={e} id={e} content={e} active={true} 
          container={'original'}
          norm_test_result={[]}
          VIFresult={null}
      />
      featureDict.origin[e] = sortableItem;
      featureDict.activ[e] = sortableItemActiv;
    });
    //console.log(featureDict);
    this.setState({sortable_components: featureDict});
  };

  updateSortableComponents = (type, param) => {
    if(type === 'normTest'){
      let featureDict = this.state.sortable_components;
      param.forEach(e=>{
        const sortableItem = cloneElement(
          featureDict.origin[e.feature],
          {norm_test_result: [e]}
        );
        const sortableItemActiv = cloneElement(
          featureDict.activ[e.feature],
          {norm_test_result: [e]}
        );

        featureDict.origin[e.feature] = sortableItem;
        featureDict.activ[e.feature] = sortableItemActiv;
      });
      //console.log(featureDict);
      return featureDict;
    }else if(type === 'VIF'){
      let featureDict = this.state.sortable_components;
      Object.keys(param).forEach(e=>{
        const sortableItem = cloneElement(
          featureDict.origin[e],
          {VIFresult: param[e]}
        );
        const sortableItemActiv = cloneElement(
          featureDict.activ[e],
          {VIFresult: param[e]}
        );

        featureDict.origin[e] = sortableItem;
        featureDict.activ[e] = sortableItemActiv;
      });
      //console.log(featureDict);
      return featureDict;
    }
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

      this.renderSortableComponents(global_data_properties_list);
      //get normality test result
      this.getNormalityTestResult(global_data_properties_list, this.state.select_case);
      this.getVIF(global_data_properties_list, this.state.select_case);
      
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
        
        viewState: viewState,
        NWSE_bounds: map_coords.NWSE_bounds,
        config_layer: config_layer,
        
      });
    }else{
      let map_coords = getCountyCenter(chicago_demo);
      let global_data_properties_list = [];
      Object.keys(chicago_demo.features[0].properties).forEach((e,i)=>{
        if(ignore_properties.indexOf(e) === -1) global_data_properties_list.push(e);
      });

      this.renderSortableComponents(global_data_properties_list);

      this.getNormalityTestResult(global_data_properties_list, this.state.select_case);
      this.getVIF(global_data_properties_list, this.state.select_case);

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

  // update sortable list
  updateSortableList = (varType, newList) => {
    if(varType === 'original'){
      this.setState({original_features: newList});
    }else if(varType === 'dependent'){
      let ori_config_layer = {
        id: 'config-fill',
        type: 'fill',
        layout: {
          'visibility': 'none',
        },
      };
      let configLayer = newList.length > 0 ? getConfigMapLayerY(newList, this.state.loaded_map_data) : ori_config_layer;
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
    //console.log(this.state.norm_test_result); 
    //if(this.state.dependent_features.length > 0 && this.state.independent_features.length > 0){
      //let newList = [this.state.dependent_features[0], this.state.independent_features[0]];
      //addBivariateProp(newList, this.state.loaded_map_data);
    //}
    
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
              original_features={this.state.original_features}
              dependent_features={this.state.dependent_features}
              independent_features={this.state.independent_features}

              sortable_components={this.state.sortable_components}

              updateSortableList={this.updateSortableList}

              norm_test_result={this.state.norm_test_result}
            />

          </Content>
        </Layout>
      </div>
    );
  }
  
}

export default App;
