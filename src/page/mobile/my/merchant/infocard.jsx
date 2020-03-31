import React from 'react';
import { Flex } from 'antd-mobile';
import Card from "../../../../components/card/index.jsx";
import './index.less';

const InfoCard = ({ data, ...props }) => (
    <Card className="profitshare_infocard" {...props}>
        <div>
            下单时间：{new Date(data.xiadantime).toLocaleString()}
        </div>
        <div>
            产品名称：{data.goods_name}
        </div>
        <div>
            产品规格：{data.itemSpecification}
        </div>
        <div>
            销售数量：{data.quantity}
        </div>
        <div>
            销售价格：￥{data.originalPrice}
        </div>
        <div>
            分成金额：￥{data.share_fee}
        </div>
        {/* <div style={{ flex: '0 0 45%' }}>
                <div className="iconH iconH_inline icon_time" style={{ marginRight: '10px', overflow: 'hidden' }} />
                分成时间：{new Date(data.fenchengtime).toLocaleString()}
            </div> */}
        {/*<Flex>*/}
        {/*    /!* <div style={{ flex: '0 0 55%' }}>*/}
        {/*        <div className="iconH iconH_inline icon_time" style={{ marginRight: '10px' }} />*/}
        {/*        产品名称：{data.goods_name}*/}
        {/*    </div> *!/*/}
        {/*    /!*<div style={{ flex: '0 0 55%' }}>*!/*/}
        {/*    /!*    <div style={{ marginRight: '10px', overflow: 'hidden' }} />*!/*/}
        {/*    /!*    产品规格：{data.itemSpecification}*!/*/}
        {/*    /!*</div>*!/*/}
        {/*    /!*<div style={{ flex: '0 0 40%' }}>*!/*/}
        {/*    /!*    <div style={{ marginRight: '10px' }} />*!/*/}
        {/*    /!*    销售数量：{data.quantity}*!/*/}
        {/*    /!*</div>*!/*/}
        {/*</Flex>*/}
        {/* <Flex>
            <div style={{ flex: '0 0 55%' }}>
                <div className="iconH iconH_inline icon_time" style={{ marginRight: '10px' }} />
                销售数量：{data.quantity}
            </div>
            <div style={{ flex: '0 0 45%' }}>
                <div className="iconH iconH_inline icon_usero" style={{ marginRight: '10px', overflow: 'hidden' }} />
                原销售价：{data.originalPrice}
            </div>
        </Flex> */}
        {/*<Flex wrap="wrap">*/}

        {/*    <div style={{ flex: '0 0 55%' }}>*/}
        {/*        <div  style={{ marginRight: '10px', overflow: 'hidden' }} />*/}
        {/*        原销售价：￥{data.originalPrice}*/}
        {/*    </div>*/}
        {/*    <div style={{ flex: '0 0 40%' }}>*/}
        {/*        <div style={{ marginRight: '10px' }} />*/}
        {/*        微商分成总额：￥{data.share_fee}*/}
        {/*    </div>*/}

        {/*</Flex>*/}
        {/*<Flex>*/}
        {/*    <div style={{flex:'0 0 55%'}}>*/}
        {/*        <div className="iconH iconH_inline icon_coins" style={{marginRight:'10px'}}/>利润：￥{data.total_fee}*/}
        {/*    </div>*/}
        {/*</Flex>*/}
    </Card>
);

export default InfoCard;
