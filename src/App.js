import React, {Component, cloneElement} from 'react';
import {Layout} from 'antd';
//import {Row, Col} from 'antd';
import Map, { Source, Layer, useMap } from 'react-map-gl';
import axios from 'axios';

// custom components
import NavBar from './components/nav';
import ModelConfigPanel from './components/modelConfig';
import { ModelExplore } from './components/modelExplore';
import { ModelCase2 } from './components/modelCase2';
import DrawControl from './utilities/mapDraw';

// import css style files
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/App.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

// import utilities
import { 
  getCountyCenter, 
  getConfigMapLayerY, 
  addBivariateProp, 
  getConfigMapLayerYX, 
  getDiagnosticMapLayer 
} from './utilities';

import { SortableItem } from './utilities/sortableItem';

/** import data */ 
//import {DATA_NAME} from "./resource/data_example";
import georgia_demo from './data/georgia_demo.json';
import chicago_demo from './data/chicago_config_poly.json';
// temporal import
//import model_result from './data/temp/model_result.json';
import model_result from './data/temp/case_demo.json';
//Case2
import case2_result from './data/2016Election_new.json';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FubWlzYW4iLCJhIjoiY2sxOWxqajdjMDB2ZzNpcGR5aW13MDYzcyJ9.WsMnhXizk5z3P2C351yBZQ'; // Set your mapbox token here
const ignore_properties = ['county_name', 'state_name', 'UID', 'Long_', 'Lat', 'ID', 'name', 'biVariateLayer'];

class App extends Component {
  constructor(props) {
    super(props);
    /** Initialize the data
     * TODO: Modify the state initial with a more flexible way
     */
    this.canvasRef = React.createRef();
    
    this.state = {
      // model config states
      model_trained: false,
      model_used: '',
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
      dependentMapLayer: {},

      currentActivMapLayer: null, // actived map layer linked with config_layer
      currentCorrMapLayer: null,
      norm_test_result: [],
      VIF_test_result: {},
      logtrans_backup: {
        feature: null,
        old_results: null
      },

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

      // Model exploration
      model_param: {
        dependent_Y: null,
        Y_data: null,
        X_list: null,
        spatial_kernel: null,
        model_type: null,
        gwr_mgwr: null,
        dataset: null
      },
      model_result: {},
      case_demo: {},
      mapFilter: ['!', ['in', 'UID', ""]],
      mapLegend: {
        layer: null,
        id: null,
      },

      externalCase: 'general',
      textFilter: ['in', 'UID', ''],
    };
  }

  getNormalityTestResult = (featureList, select_case) => {
    axios.get('http://demo.vaderlab.org:5006/models/api/v0.1/calibration/normality/'+featureList+'+'+select_case)
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
    axios.get('http://demo.vaderlab.org:5006/models/api/v0.1/calibration/VIF/'+featureList+'+'+select_case)
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

  logTransform = (feature, select_case) => {
    if(this.state.logtrans_backup.feature === feature){
      let oldResults = this.state.logtrans_backup.old_results[0];
      //console.log(oldResults);
      let norm_test_result = this.state.norm_test_result.map(e=>{
        if(e.feature === feature){
          e.p_value = oldResults.p_value;
          e.skewness = oldResults.skewness;
          e.Y = oldResults.Y;
          return e;
        }else{
          return e;
        }
      });
      let initLogResult = {
        feature: null,
        old_results: null
      };
      //console.log('back to origin');
      const featureDict = this.updateSortableComponents('normTest', norm_test_result);
      // update states
      this.setState({
        norm_test_result: norm_test_result,
        sortable_components: featureDict,
        logtrans_backup: initLogResult
      });
      
    }else{
      //console.log(feature, select_case);
      axios.get('http://demo.vaderlab.org:5006/models/api/v0.1/calibration/normality/log-transform/'+feature+'+'+select_case)
      .then(response => {
        //console.log(feature);
        //console.log(this.state.norm_test_result);
        let norm_new = response.data.normality_results;
        let old_norm = {
          Y: this.state.norm_test_result.filter(e=>e.feature === feature)[0].Y,
          p_value: this.state.norm_test_result.filter(e=>e.feature === feature)[0].p_value,
          skewness: this.state.norm_test_result.filter(e=>e.feature === feature)[0].skewness
        };
        
        let norm_test_result = this.state.norm_test_result.map(e=>{
          if(e.feature === feature){
            e.p_value = norm_new.p_value;
            e.skewness = norm_new.skewness;
            e.Y = norm_new.Y;
            return e;
          }else{
            return e;
          }
        });
        let logResultBackup = {
          feature: feature,
          old_results: [old_norm],
        };
        const featureDict = this.updateSortableComponents('normTest', norm_test_result);
        // update states
        this.setState({
          norm_test_result: norm_test_result,
          sortable_components: featureDict,
          logtrans_backup: logResultBackup
        });
        //console.log(logResultBackup);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
      
    }
    
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
          corrBtnActiv={true}
          norm_test_result={[]}
          VIFresult={null}
          mapBtnActiv={'default'}
          corrBtnType={'default'}
          handleMapBtnClick={this.handleMapBtnClick}
          handleCorrBtnclick={this.handleCorrBtnclick}
          corrLegend={false}
      />
      let sortableItemActiv = 
      <SortableItem
          key={e} id={e} content={e} active={true} 
          corrBtnActiv={true}
          container={'original'}
          norm_test_result={[]}
          VIFresult={null}
          mapBtnActiv={'default'}
          corrBtnType={'default'}
          handleMapBtnClick={this.handleMapBtnClick}
          handleCorrBtnclick={this.handleCorrBtnclick}
          corrLegend={false}
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
    }else if(type === 'activCorrBtn'){
      let featureDict = this.state.sortable_components;
      this.state.data_properties.forEach(e=>{
        const sortableItem = cloneElement(
          featureDict.origin[e],
          {corrBtnActiv: false}
        );
        const sortableItemActiv = cloneElement(
          featureDict.activ[e],
          {corrBtnActiv: false}
        );

        featureDict.origin[e] = sortableItem;
        featureDict.activ[e] = sortableItemActiv;
      });
      return featureDict;
    }else if(type === 'deactivCorrBtn'){
      let featureDict = this.state.sortable_components;
      this.state.data_properties.forEach(e=>{
        const sortableItem = cloneElement(
          featureDict.origin[e],
          {corrBtnActiv: true}
        );
        const sortableItemActiv = cloneElement(
          featureDict.activ[e],
          {corrBtnActiv: true}
        );

        featureDict.origin[e] = sortableItem;
        featureDict.activ[e] = sortableItemActiv;
      });
      return featureDict;
    }else if(type === 'updateMapClickBtn'){
      let currentActivMapLayer = this.state.currentActivMapLayer !== param ? param : null;
      let featureDict = this.state.sortable_components;
      this.state.data_properties.forEach(e=>{
        const sortableItem = cloneElement(
          featureDict.origin[e],
          {
            mapBtnActiv: e !== currentActivMapLayer ? 'default' : 'primary',
            corrBtnType: 'default',
          }
        );
        const sortableItemActiv = cloneElement(
          featureDict.activ[e],
          {
            mapBtnActiv: e !== currentActivMapLayer ? 'default' : 'primary',
            corrBtnType: 'default',
          }
        );

        featureDict.origin[e] = sortableItem;
        featureDict.activ[e] = sortableItemActiv;
      });
      return featureDict;
    }else if(type === 'logTransform'){
      let normResult = param.normResult;
      let featureDict = this.state.sortable_components;
      this.state.data_properties.forEach(e=>{
        if(e === param.feature){
          const sortableItem = cloneElement(
            featureDict.origin[e],
            {norm_test_result: [normResult]}
          );
          const sortableItemActiv = cloneElement(
            featureDict.activ[e],
            {norm_test_result: [normResult]}
          );
  
          featureDict.origin[e] = sortableItem;
          featureDict.activ[e] = sortableItemActiv;
        }
      });
      return featureDict;
    }else if(type === 'updateCorrBtnClick'){
      let currentCorrMapLayer = this.state.currentCorrMapLayer !== param ? param : null;
      let featureDict = this.state.sortable_components;
      this.state.data_properties.forEach(e=>{
        const sortableItem = cloneElement(
          featureDict.origin[e],
          {corrBtnType: e !== currentCorrMapLayer ? 'default' : 'primary'},
        );
        const sortableItemActiv = cloneElement(
          featureDict.activ[e],
          {corrBtnType: e !== currentCorrMapLayer ? 'default' : 'primary'},
        );

        featureDict.origin[e] = sortableItem;
        featureDict.activ[e] = sortableItemActiv;
      });
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
      let data_properties = [];
      Object.keys(georgia_demo.features[0].properties).forEach((e,i)=>{
        if(ignore_properties.indexOf(e) === -1){
          data_properties.push(e);
          global_data_properties_list.push(e);
        }
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
        model_trained: false,
        loaded_map_data: georgia_demo,
        data_properties: data_properties,
        original_features: global_data_properties_list,
        dependent_features: [],
        independent_features: [],
        
        viewState: viewState,
        NWSE_bounds: map_coords.NWSE_bounds,
        config_layer: config_layer,

        currentActivMapLayer: null
      });
    }else{
      let map_coords = getCountyCenter(chicago_demo);
      let global_data_properties_list = [];
      let data_properties = [];
      Object.keys(chicago_demo.features[0].properties).forEach((e,i)=>{
        if(ignore_properties.indexOf(e) === -1){
          data_properties.push(e);
          global_data_properties_list.push(e);
        }
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
        model_trained: false,
        loaded_map_data: chicago_demo,
        data_properties: data_properties,
        original_features: global_data_properties_list,
        dependent_features: [],
        independent_features: [],
       
        viewState: viewState,
        NWSE_bounds: map_coords.NWSE_bounds,
        config_layer: config_layer,

        currentActivMapLayer: null,
        
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
     
      if(newList.length > 0){
        this.handleMapBtnClick(newList[0]);
        const sortableComponents = this.updateSortableComponents('activCorrBtn');
        this.setState({
          dependentMapLayer: getConfigMapLayerY(newList, this.state.loaded_map_data),
          mapLegend:{
            layer: 'dependent',
            id: newList[0]
          },
          sortable_components: sortableComponents,
        });
      }else if(newList.length === 0){
        const sortableComponents = this.updateSortableComponents('deactivCorrBtn');
        this.setState({sortable_components: sortableComponents});
      }
      //console.log(configLayer);
      this.setState({
        dependent_features: newList,
        //config_layer: configLayer,
      });
    }else{ // independent list
      //if(newList.length > 0){
        //let geoData = addBivariateProp(newList, this.state.loaded_map_data);
        //this.setState({loaded_map_data: geoData});
        //let configLayer = getConfigMapLayerYX();
        //this.setState({config_layer: configLayer});
      //}
      this.setState({
        independent_features: newList
      });
    }
  };

  // update actived map layer
  handleMapBtnClick = (id) => {
    //console.log(id);
    let currentActivMapLayer = this.state.currentActivMapLayer !== id ? id : null;
    let ori_config_layer = {
      id: 'config-fill',
      type: 'fill',
      layout: {
        'visibility': 'none',
      },
    };
    let configLayer = currentActivMapLayer !== null ? getConfigMapLayerY([id], this.state.loaded_map_data) : ori_config_layer;   
    let sortableComponents = this.updateSortableComponents('updateMapClickBtn', id);
    this.setState({
      currentActivMapLayer: currentActivMapLayer,
      config_layer: configLayer,
      sortable_components: sortableComponents,
      currentCorrMapLayer: null,
      mapLegend:{
        layer: 'dependent',
        id: id
      },
    });

  };

  // show correlation map
  handleCorrBtnclick = (id) => {
    //let geodata = this.state.loaded_map_data;
    let currentCorrMapLayer = this.state.currentCorrMapLayer !== id ? id : null;
    if(currentCorrMapLayer !== null){
      // display correlation map
      let corrList = [this.state.dependent_features[0], id];
      this.setState({loaded_map_data: addBivariateProp(corrList, this.state.loaded_map_data)});
      let configLayer = getConfigMapLayerYX();
      let sortableComponents = this.updateSortableComponents('updateMapClickBtn', this.state.currentActivMapLayer);
      this.setState({
        currentActivMapLayer: null,
        sortable_components: sortableComponents,
        config_layer: configLayer,
        mapLegend:{
          layer: 'bi-var',
          id: corrList
        },
      });
    }else{
      // display dependent variable map
      let configLayer = this.state.dependentMapLayer;
      let sortableComponents = this.updateSortableComponents('updateMapClickBtn', this.state.dependent_features[0]);
      this.setState({
        currentActivMapLayer: this.state.dependent_features[0],
        sortable_components: sortableComponents,
        config_layer: configLayer
      });
    }

    let sortableComponents = this.updateSortableComponents('updateCorrBtnClick', id);
    //console.log(this.state.dependentMapLayer);
    //console.log(this.state.config_layer);
    this.setState({
      //config_layer: this.state.config_layer,
      currentCorrMapLayer: currentCorrMapLayer,
      sortable_components: sortableComponents,
    });
  };

  //MAIN APP Controllers
  onHover = (event) => {
    const {
      features,
      point: {x, y}
    } = event;
    let feature = features && features[0];
    let hoverInfo = {
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      UID: feature && feature.properties.UID,
      properties: feature && feature.properties,
      x,
      y
    };
    //console.log(hoverInfo);
    hoverInfo.UID !== undefined?this.setState({hoverInfo: hoverInfo}):this.setState({hoverInfo: null});
  };

  trainModel = () => {
    // click model training btn
    if(this.state.dependent_features.length > 0 && this.state.independent_features.length > 0){
      
      let model_param = {
        'dependent_Y': this.state.dependent_features[0],
        'Y_data': this.state.norm_test_result.filter(e=>e.feature === this.state.dependent_features[0])[0].Y,
        'X_list': this.state.independent_features,
        'spatial_kernel': this.state.spatial_kernel,
        'model_type': this.state.model_type,
        'gwr_mgwr': this.state.local_modal,
        'dataset': this.state.select_case
      };
      /* TODO after interface has been developed!
      axios.post('http://demo.vaderlab.org:5006/models/api/v0.1/models', model_param)
      .then(response => {
        console.log(response);
        // update states
        this.setState({case_demo: response.data.added_model});
      })
      .catch(error => {
        console.log(error);
      });
      */

      let currentActivMapLayer = null;
      let ori_config_layer = {
        id: 'config-fill',
        type: 'fill',
        layout: {
          'visibility': 'none',
        },
      };
      
      this.setState({
        model_trained: true,
        model_used: 'GWR',
        loaded_map_data: model_result.geojson_poly,
        currentActivMapLayer: currentActivMapLayer,
        config_layer: ori_config_layer,
        model_result: model_result
      });

      if(this.state.select_case === 'chicago')
        this.canvasRef.current.flyTo({center: [this.state.viewState.longitude-0.2, this.state.viewState.latitude]});
      
    }else{

    }
    
  };

  mapFly = (coord) => {
    //console.log(coord);
    this.canvasRef.current.flyTo({center: [coord[0]-3, coord[1]], zoom: 7});
  };

  loadCase = () => {
    let currentActivMapLayer = null;
    let ori_config_layer = {
      id: 'config-fill',
      type: 'fill',
      layout: {
        'visibility': 'none',
      },
    };

    console.log(case2_result);
    this.setState({
      model_trained: true,
      model_used: 'MGWR',
      loaded_map_data: case2_result.geojson_poly,
      currentActivMapLayer: currentActivMapLayer,
      config_layer: ori_config_layer,
      model_result: case2_result,
      select_case: "US_election"
    });
  };

  exportData = () => {
    let model_param = {
      'dependent_Y': this.state.dependent_features[0],
      'Y_data': this.state.norm_test_result.filter(e=>e.feature === this.state.dependent_features[0])[0].Y,
      'X_list': this.state.independent_features,
      'spatial_kernel': this.state.spatial_kernel,
      'model_type': this.state.model_type,
      'gwr_mgwr': this.state.local_modal,
      'dataset': this.state.select_case
    };
    axios.post('http://demo.vaderlab.org:5006/models/api/v0.1/models', model_param)
      .then(response => {
        console.log(response);
        // update states
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
          JSON.stringify(response.data.added_model)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "case_demo.json";
    
        link.click();
      })
      .catch(error => {
        console.log(error);
      });
    
  };

  /**
   *  TRAINED MODEL EXPLORATION
   */

  setMapLayer = (id, filter) => {
    const updateActivMapLayer = id;
    console.log(id);
    //need to be changed
    const newMapLayer = getDiagnosticMapLayer(id, this.state.loaded_map_data, filter);
    this.setState({
      currentActivMapLayer: updateActivMapLayer,
      config_layer: newMapLayer,
      currentCorrMapLayer: null,
      mapLegend:{
        layer: 'result',
        id: id
      },
    });
  };

  setMapFilter = (list) => {
    let filter = ['in', 'UID'];
    //console.log(list);
    let maplayer = JSON.parse(JSON.stringify(this.state.config_layer));
    if(this.state.currentCorrMapLayer !== null){
      if(list.length > 0){
        list.forEach(e=>{
          filter.push(e);
        });
        maplayer.filter = filter;
        this.setState({config_layer: maplayer});
      }else{
        if(maplayer.hasOwnProperty('filter')) delete maplayer['filter'];
        this.setState({config_layer: maplayer});
      }
    }
  };

  setTextFilter = (list) => {
    let filter = ['in', 'UID'];
    if(list.length > 0){
      list.forEach(e=>{
        filter.push(e);
      });
      this.setState({textFilter: filter});
    }else{
      this.setState({textFilter: ['in', 'UID', '']});
    }
  };

  onDrawCreate = ({ features }) => {
    this.setState({externalCase: 'select'});
    //console.log(features, 1);
  };

  onDrawUpdate = ({ features }) => {
    console.log(features, 2);
  };

  onDrawDelete = ({ features }) => {
    this.setState({externalCase: 'general'});
    //console.log(features, 3);
  };

  setExternalCase = (val) => {
    if(val === 'select'){
      this.setState({externalCase: 'select'});
    }else if(val === 'general'){
      this.setState({externalCase: 'general'});
    }else if(val === 'loop'){
      this.setState({externalCase: 'loop'});
    }
    
  };

  handleMapClick = (evt) => {
    //console.log(evt.features);
    if(evt.features[0].properties.county_name === "Athens"){
      this.setState({externalCase: 'select'});
    }
    
  };

  render() {
    const drawmap = this.state.loaded_map_data === null ? <></> : 
    <DrawControl
      map={this.canvasRef.current}
      position="top-right"
      displayControlsDefault={false}
      controls={{
        polygon: true,
        trash: true
      }}
      onDrawCreate={this.onDrawCreate}
      onDrawUpdate={this.onDrawUpdate}
      onDrawDelete={this.onDrawDelete}
    />;

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
        <Layer beforeId="waterway-label" {...this.state.hover_border_layer} filter={this.state.textFilter} />
      </Source>;
    
    return (
      <div className="App">
        <Layout className="mainContainer">
          <Header className="headContainer">
            <NavBar
              select_case={this.state.select_case}
              handleCaseSelectionChange={this.handleCaseSelectionChange}
              handleLoadData={this.handleLoadData}
              handleLoadCase={this.loadCase}
            />
          </Header>
          <Content className="vastContainer">
            {/**
             * Main layout of the systemx
             */}
            <Map
              ref={this.canvasRef}
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
              onClick={evt => this.handleMapClick(evt)}
            >
              {drawmap}
              {this.state.loaded_map_data && (default_source_layers)}
              {this.state.hoverInfo && (
                <div className="maptooltip" style={{left: this.state.hoverInfo.x, top: this.state.hoverInfo.y}}>
                  <div>{this.state.hoverInfo.properties.county_name}</div>
                  {this.state.currentCorrMapLayer !== null ?
                  <div>{this.state.currentCorrMapLayer}: {this.state.hoverInfo.properties[this.state.currentCorrMapLayer].toFixed(2)}</div> : 
                  (this.state.model_trained ? <><div>{this.state.currentActivMapLayer}: {this.state.hoverInfo.properties[this.state.currentActivMapLayer]}</div> 
                  <div>Coefficient: {this.state.hoverInfo.properties[this.state.currentActivMapLayer+'_coefficient']}</div></>:
                  <div>{this.state.currentActivMapLayer}: {this.state.hoverInfo.properties[this.state.currentActivMapLayer].toFixed(2)}</div>)}
                  
                </div>
              )}
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


              currentActivCorrelation={this.state.currentCorrMapLayer}
              currentActivMapLayer={this.state.config_layer}
              loaded_map_data={this.state.loaded_map_data}
              VIF_test_result={this.state.VIF_test_result}

              logTransform={this.logTransform}
              select_case={this.state.select_case}
              logtrans_backup={this.state.logtrans_backup}

              trainModel={this.trainModel}
              exportData={this.exportData}
              setMapFilter={this.setMapFilter}
              mapLegend={this.state.mapLegend}
            />

            <ModelExplore
              model_trained={this.state.model_trained}
              model_result={this.state.model_result}
              model_used={this.state.model_used}
              setMapLayer={this.setMapLayer}
              select_case={this.state.select_case}
              mapLegend={this.state.mapLegend}
              loaded_map_data={this.state.loaded_map_data}
              externalCase={this.state.externalCase}
              setExternalCase={this.setExternalCase}
              setMapFilter={this.setTextFilter}
            />

            <ModelCase2 
              model_trained={this.state.model_trained}
              model_result={this.state.model_result}
              model_used={this.state.model_used}
              setMapLayer={this.setMapLayer}
              select_case={this.state.select_case}
              mapLegend={this.state.mapLegend}
              loaded_map_data={this.state.loaded_map_data}
              externalCase={this.state.externalCase}
              setExternalCase={this.setExternalCase}
              setMapFilter={this.setTextFilter}
              mapFly={this.mapFly}
            />

          </Content>
        </Layout>
      </div>
    );
  }
  
}

export default App;
