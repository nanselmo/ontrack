import * as React from "react";

import Timeout from "shared/util/timeout";
import Field from "shared/components/form/field";

interface AddressInfo {
  address: string
  tier: string
}

interface AddrTierCalcProps {
  addressLabel: string
  tierLabel: string
  address: string | null
  tier: string | null
}

interface AddrTierCalcState {
  request?: Promise<string> 
  address: string | null
  tier: string | null
  timeoutInstance?: Timeout | null,
}

export class AddressTierCalculator extends React.Component<AddrTierCalcProps, AddrTierCalcState> {

  constructor(props){
    super(props);
    this.state = {
      address: props.address,
      tier: props.tier,
      timeoutInstance: null,
    };
  } 

  private now(): number {
    return new Date().valueOf();
  }

  handleAddressInput(event: React.ChangeEvent<HTMLInputElement>): void {
    // only send request for Address tier when TIMEOUT_DELAY number
    // of ms have passed since last change event.
    const TIMEOUT_DELAY = 1500; // ms
    const address: string = event.target.value;
    const newTimeout: Timeout = new Timeout( () => {
      console.log(address);
    }, TIMEOUT_DELAY);

    if (this.state.timeoutInstance !== null) {
      this.state.timeoutInstance.cancel();
    }

    newTimeout.start();
    this.setState({
      timeoutInstance: newTimeout 
    });
  }

  render() {
    return (
      <div 
        style={{
          display: "flex", 
          flexDirection: "row", 
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "center"
        }} >
        <div className="mui-textfield" style={{flex: "4 1 auto"}}>
          <input onChange={this.handleAddressInput.bind(this)} type="text"/>
          <label>{this.props.addressLabel}</label>
        </div>
        <Field label={this.props.tierLabel} value={this.state.tier}/>
      </div>
    )

  }
}
