import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Descriptions, Table, Button } from 'antd';
import { BarChartOutlined, FileSearchOutlined, CopyOutlined } from '@ant-design/icons';
import { Boxplot } from "../../utilities/boxplot";

export function ModelPerformance (props){
    const [globalInfoDiv, setGlobalInfoDiv] = useState(<></>);
    const [localInfoData, setLocalInfoData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState(['local_R2']);

    const makeGlobalInfo = (ginfo, modeltype) => {
        setGlobalInfoDiv(
            <Descriptions 
                column={4} size={'small'} bordered layout="vertical" 
                labelStyle={{fontSize: 13}} 
                contentStyle={{fontSize: 13}} 
            >
                <Descriptions.Item label="Model Type"><b>{modeltype}</b></Descriptions.Item>
                <Descriptions.Item label="AICc">{ginfo.AICc.toFixed(2)}</Descriptions.Item>
                <Descriptions.Item label={'R2'}>{ginfo.R2.toFixed(2)}</Descriptions.Item>
                <Descriptions.Item label={'Adj. R2'}>{ginfo.adj_R2.toFixed(2)}</Descriptions.Item>
            </Descriptions>
        );
    };

    const makeLocalInfoTableData = (local_r2, cooksd, residual) => {
        const tableData = [
            {
                key: 'local_R2',
                indicator: 'Local R2',
                //mean: local_r2.mean.toFixed(2),
                numerical_distribution: local_r2,
                //std: local_r2.std.toFixed(2),
                operations: 'local_R2',
            },{
                key: 'cooksD',
                indicator: 'Cook\'s distance',
                //mean: cooksd.mean.toFixed(2),
                numerical_distribution: cooksd,
                //std: cooksd.std.toFixed(2),
                operations: 'cooksD',
            },{
                key: 'std_residuals',
                indicator: 'Residuals',
                //mean: residual.mean.toFixed(2),
                numerical_distribution: residual,
                //std: residual.std.toFixed(2),
                operations: 'std_residuals',
            }
        ];
        setLocalInfoData(tableData);
    };

    const local_columns = [
        {
            title: 'Indicator',
            dataIndex: 'indicator',
            key: 'indicator',
        },
        {
            title: 'Numerical distribution',
            dataIndex: 'numerical_distribution',
            key: 'numerical_distribution',
            render: (_, { numerical_distribution }) => {
                //console.log(numerical_distribution);
                return(
                    <Boxplot
                        echartBoxplotData={numerical_distribution}
                        resource={'inline'}
                        height={30}
                        width={190}
                    />
                );
            },
        },
        {
            title: 'Operations',
            dataIndex: 'opeartions',
            key: 'operations',
            render: (_, { operations }) => {
                //console.log(operations, props.numericalBtnSelect);
                return(
                    <>
                    <Button 
                        size='small' icon={<BarChartOutlined />} style={{marginRight: 5}}
                        type={operations === props.numericalBtnSelect ? 'primary' : 'text'}
                        onClick={() => props.handleNumBtnClick(operations)}
                    ></Button>
                    <Button 
                        size='small' icon={<FileSearchOutlined />}
                        type={operations === props.narrativeBtnSelect ? 'primary' : 'text'}
                        onClick={() => props.handleNarrativeBtnClick(operations)}
                    ></Button>
                    </>
                    
                );
            },
        },
      ];

    useEffect(()=>{
        //console.log(props.local_r2);
        makeGlobalInfo(props.globalInfo, props.model_used);
        makeLocalInfoTableData(props.local_r2, props.cooksd, props.residual);
        props.setMapLayer('local_R2');
        props.setNumericalDist(props.selectedRowKeys[0]);
    }, [props.globalInfo, props.model_used, props.local_r2, props.cooksd, props.residual]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          props.setSelectedRowKeys(selectedRowKeys);
          props.setMapLayer(selectedRowKeys[0]);
          props.handleNumBtnClick(selectedRowKeys[0]);
          props.handleNarrativeBtnClick(selectedRowKeys[0]);
          props.setDisplayFlag(false);
        },
    };
    
    return(
        <div className="modelPerformanceContainer">
            {/** global performance */}
            <Card
                title="Global diagnostic information"
                size="small"
                bodyStyle={{
                    padding: 0,
                }}
                extra={
                    <div
                        style={{
                            display: 'inline-block',
                            fontSize: 12
                        }}
                    >
                        <Button
                            size="small"
                            style={{
                                marginLeft: 5,
                                float: 'left'
                            }}
                            icon={<CopyOutlined />}
                            onClick={() => props.globalInfoGen()}
                        ></Button>

                    </div>
                }
            >
                {globalInfoDiv}
            </Card>

            <Card
                title="Local diagnostic information"
                size="small"
                style={{marginTop: 8}}
                bodyStyle={{
                    padding: 0
                }}
            >
                <Table
                    size="small"
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: props.selectedRowKeys,
                        ...rowSelection,
                    }}
                    columns={local_columns}
                    dataSource={localInfoData}
                    pagination={false}
                    /*
                    onRow={record => {
                        return{
                            onClick: event => {
                                //let selectedPrompt = promptList[record.key];
                                props.setSelectedRowKeys([record.key]);
                                props.setMapLayer(record.key);
                                props.handleNumBtnClick(record.key);
                                props.handleNarrativeBtnClick(record.key);
                            },
                        };
                    }}
                    */
                />                
            </Card>
        </div>
    );
}
