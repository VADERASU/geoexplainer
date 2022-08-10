import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Descriptions, Table, Radio} from 'antd';

export function ModelPerformance (props){
    const [globalInfoDiv, setGlobalInfoDic] = useState(<></>);
    const [localInfoData, setLocalInfoData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([0]);

    const makeGlobalInfo = (ginfo, modeltype) => {
        setGlobalInfoDic(
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
                key: 0,
                indicator: 'Local R2',
                mean: local_r2.mean.toFixed(2)
            },{
                key: 1,
                indicator: 'Cook\'s distance',
                mean: cooksd.mean.toFixed(2)
            },{
                key: 2,
                indicator: 'Residuals',
                mean: residual.mean.toFixed(2)
            }
        ];
        setLocalInfoData(tableData);
    };

    const local_columns = [
        {
          title: 'Indicator',
          dataIndex: 'indicator',
        },
        {
          title: 'Mean',
          dataIndex: 'mean',
        }
      ];

    useEffect(()=>{
        console.log(props.globalInfo);
        makeGlobalInfo(props.globalInfo, props.model_used);
        makeLocalInfoTableData(props.local_r2, props.cooksd, props.residual);
        props.setMapLayer('local_R2');
    }, [props.globalInfo, props.model_used, props.local_r2, props.cooksd, props.residual]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          //let selectedPrompt = localInfoData[selectedRowKeys[0]];
          setSelectedRowKeys(selectedRowKeys);
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
                        selectedRowKeys: selectedRowKeys,
                        ...rowSelection,
                    }}
                    columns={local_columns}
                    dataSource={localInfoData}
                    pagination={false}
                    onRow={record => {
                        return{
                            onClick: event => {
                                //let selectedPrompt = promptList[record.key];
                                setSelectedRowKeys([record.key]);
                            },
                        };
                    }}
                />                
            </Card>
        </div>
    );
}
