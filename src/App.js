//import logo from './logo.svg';
import {Component} from 'react';
import './styles/App.css';
import {Layout} from 'antd';
import {Row, Col} from 'antd';
//import NavBar from './components/nav_bar';

/** import data */ 
//import {DATA_NAME} from "./resource/data_example";

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
    console.log(this.state);
    //let nodes = this.state.current_vis_data.nodes.filter(node => this.state.selectedNodeTypes.includes(node.name));
    //console.log(nodes);
    const { Header, Content } = Layout;
    //const {selectedResources} = this.state;
    //const {selectedNodeTypes} = this.state;
    
    return (
      <div className="App">
        <Layout className="mainContainer">
          <Header className="headContainer">
            <div>
              <span className="logo" href="#">GeoExplainer</span>
            </div>
          </Header>
          <Content className="vastContainer">
            {/**
             * Main layout of the system
             */}
            <Row gutter={8}>
              {/** Left part views */}
              <Col span={14}>
                <Row gutter={[8, 8]}>
                  {/** Node overview panel */}
                  <Col span={24}>
                    <div className="nodeOverview"></div>
                  </Col>
                  {/** node details panel */}
                  <Col span={24}>
                    <div className="detailPanel"></div>
                  </Col>
                </Row>   
              </Col>
            
              <Col span={10}>
              <Row gutter={[8, 8]}>
                  {/** Time-series panel */}
                  <Col span={24}>
                    <div className="viewPanel"></div>
                  </Col>
                  {/** Variable correlation panel */}
                  <Col span={12}>
                    <div className="correlationPanel"></div>
                  </Col>
                  {/** variable controller panel */}
                  <Col span={12}>
                    <div className="varControlPanel"></div>
                  </Col>
                </Row>
              </Col>
            </Row>



          </Content>
        </Layout>
      </div>
    );
  }
  
}

export default App;
