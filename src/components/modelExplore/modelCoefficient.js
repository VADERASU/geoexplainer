import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Descriptions, Table, Button } from 'antd';
import { BarChartOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Boxplot } from "../../utilities/boxplot";

export function ModelCoefficient (props) {
    const [coeffData, setcoeffData] = useState([]);
    //const [selectedRowKeys, setSelectedRowKeys] = useState(null);

    const makeLocalInfoTableData = (model_result) => {
        const tableData = [];
        model_result.X.forEach(e=>{
            const coeffData = {
                key: e,
                coefficient: e,
                mean: model_result[e].mean.toFixed(2),
                numerical_distribution: model_result[e],
                std: model_result[e].std.toFixed(2),
                operations: e,
            };
            tableData.push(coeffData);
        });
        // add intercept
        const intercept = {
            key: 'intercept',
            coefficient: 'intercept',
            mean: model_result.intercept.mean.toFixed(2),
            numerical_distribution: model_result.intercept,
            std: model_result.intercept.std.toFixed(2),
            operations: 'intercept',            
        };
        tableData.push(intercept);
        //console.log(tableData);
        setcoeffData(tableData);
    };

    const local_columns = [
        {
            title: 'Coefficient',
            dataIndex: 'coefficient',
            key: 'coefficient',
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
                    />
                );
            },
        },
        {
            title: 'Mean',
            dataIndex: 'mean',
            key: 'mean',
        },
        {
            title: 'Deviation',
            dataIndex: 'std',
            key: 'std',
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
                        //type={operations === props.narrativeBtnSelect ? 'primary' : 'text'}
                        //onClick={() => numericalBtnClick(operations)}
                    ></Button>
                    </>
                    
                );
            },
        },
    ];

    useEffect(()=>{
        //console.log(props.model_result);
        makeLocalInfoTableData(props.model_result);
    }, [props.model_result]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          props.setSelectedRowKeys(selectedRowKeys);
          props.setMapLayer(selectedRowKeys[0]);
          props.handleNumBtnClick(selectedRowKeys[0]);
        },
    };

    return (
        <Card
            className="explorationCard"
            title="Local coefficients"
            size="small"
            style={{marginTop: 8}}
            bodyStyle={{
                padding: 0,
                height: 300,
                overflow: 'auto',
            }}
            extra={
                <div
                    style={{
                        display: 'inline-block',
                        fontSize: 12
                    }}
                >
                    <b>Model's dependent variable:</b> {props.model_result.Y}
                </div>
            }
        >
            <Table
                size="small"
                rowSelection={{
                    type: 'radio',
                    selectedRowKeys: props.selectedRowKeys[0] === 'local_R2' ? null : props.selectedRowKeys,
                    ...rowSelection,
                }}
                columns={local_columns}
                dataSource={coeffData}
                pagination={false}
                onRow={record => {
                    return{
                        onClick: event => {
                            //let selectedPrompt = promptList[record.key];
                            props.setSelectedRowKeys([record.key]);
                            props.setMapLayer(record.key);
                            props.handleNumBtnClick(record.key);
                        },
                    };
                }}
            />
        </Card>
    );
}
