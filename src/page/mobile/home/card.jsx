import React from 'react';
import {Card, Flex, WhiteSpace, WingBlank} from 'antd-mobile';
import {getServerIp} from "../../../config.jsx";


export const InfoCard = (props) => {
    let card = props.cardData;

    console.log("card", card);

    if (!card || !card.weBusiness)
        return null;

    let weHead = null;
    if (card.weBusiness.logo) {
        if (card.weBusiness.logo.indexOf("/resource") === -1)
            weHead = card.weBusiness.logo;
        else
            weHead = "http://" + getServerIp() + card.weBusiness.logo;
    }

    return <Card className="info_card">
        <div className="card_div">
            <WingBlank>
                <div className="title">{card.weBusiness.shopName}</div>

                <WhiteSpace/>

                <Flex direction='row'>
                    <div style={{width: '40%', height: '6.5rem'}}>
                        <img src={weHead}
                             style={{
                            width: '6rem', height: '6rem', paddingLeft: '1%',
                            paddingRight: '1%', paddingTop: '1%', borderRadius: '50%', marginLeft: '15%'
                        }}/>
                    </div>

                    <div style={{width: '60%', height: '5.5rem'}}>
                        <Flex direction='column' justify='start' align='start'>
                            <WhiteSpace/>
                            <Flex.Item>
                            </Flex.Item>
                            <Flex.Item className="info_name">店主：
                                <span style={{fontWeight: 'initial'}}>{card.weBusiness.name}</span>
                            </Flex.Item>
                            <WhiteSpace/>
                            <Flex.Item className="info_name">手机：
                                <a href={"tel:" + card.weBusiness.mobile}
                                   style={{color: 'blue', fontWeight: 'initial'}}>
                                    {card.weBusiness.mobile}
                                </a>
                            </Flex.Item>
                            <WhiteSpace/>
                            <Flex.Item className="info_name">地址：
                                <span style={{fontWeight: 'initial'}}>{card.weBusiness.address}</span>
                            </Flex.Item>
                        </Flex>
                    </div>
                </Flex>

                <WhiteSpace/>

            </WingBlank>
        </div>
    </Card>
};