import * as React from "react";

import Timeout from "shared/util/timeout";
import {Form, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import TierDisplay from "./tier-display";

import {getTier, GetTierError} from "shared/util/get-tier";

import "./address-tier-calculator.scss";

type Geolocation = {latitude: number, longitude: number};
interface AddressInfo {
  address: string
  tier: string
  geolocation: Geolocation
}

interface AddrTierCalcProps {
  address: string | null
  tier: string | null
  geolocation: Geolocation | null
  onAddressChange: (newAddress: string) => any
  onTierChange: (newTier: string) => any
  onGeolocationChange: (newGeo: Geolocation) => any
}

interface AddrTierCalcState {
  address: string
  tier: string
  geo: Geolocation
  request?: Promise<string> 
  timeoutInstance?: Timeout | null
  requestInProgress: boolean
  addressValidationState: null | "success" | "warning" | "error"
}

export default class AddressTierCalculator extends React.Component<AddrTierCalcProps, AddrTierCalcState> {

  constructor(props){
    super(props);
    this.state = {
      address: props.address ? props.address : "",
      tier: props.tier ? props.tier : "",
      geo: props.geolocation ? props.geolocation : {latitude: 0, longitude: 0},
      timeoutInstance: null,
      requestInProgress: false,
      addressValidationState: null
    };
  } 

  private now(): number {
    return new Date().valueOf();
  }

  private setRequestInProgress = (isInProgress: boolean) => {
    if (isInProgress !== this.state.requestInProgress) {
      this.setState({
        requestInProgress: isInProgress
      });
    }
  }

  private handleAddressChange = (event: React.ChangeEvent<any>): void => {
    const address: string = event.target.value;
    const TIMEOUT_DELAY = 1000; // ms

    this.setState({
      address: address,
      addressValidationState: null,
      tier: null
    });

    const validate = (address: string) => {
      // TODO: extend
      return address && address.length > 5;
    };

    // after a timeout (to make sure that we don't send a ton of requests)
    // send a request for the tier
    const newTimeout = new Timeout( () => {

      // signal that request is in progress
      this.setRequestInProgress(true);

      // if address passes basic validation
      if (validate(address)) {
        getTier(address).then( ({tier, geo}) => {
          this.setState({
            tier: tier,
            geo: geo,
            addressValidationState: "success"
          });
          this.setRequestInProgress(false);
          this.props.onAddressChange(address.trim());
          this.props.onTierChange(tier);
          this.props.onGeolocationChange(geo);

        }).catch( err => {
          if (err === GetTierError.InvalidAddressErr) {
            this.setState({
              addressValidationState: "error"
            });
            this.setRequestInProgress(false);
          } else if (err === GetTierError.NoTierFoundErr) {
            this.setState({
              addressValidationState: "warning"
            });
            this.setRequestInProgress(false);
          } else if (err === GetTierError.RequestFailedErr) {
            this.setState({
              addressValidationState: "warning"
            });
            this.setRequestInProgress(false);
          }
        });
      }
    }, TIMEOUT_DELAY);

    if (this.state.timeoutInstance !== null) {
      this.state.timeoutInstance.cancel();
    }

    newTimeout.start();
    this.setState({
      timeoutInstance: newTimeout 
    });
  }

  private handleTierChange(event: React.FormEvent<any>) {
    const newTier: string = event.currentTarget.value;
    this.props.onTierChange(newTier);
  }

  private displayStatusMessage(state: string): string {
    if (state === "warning") {
      return "Your address is right, but it doesn't seem to be in the Chicago Public Schools boundary. Are you sure you used the right address?"
    } else if (state === "error") {
      return "We can't find your address -- are you sure you entered it correctly?";
    } else {
      return "No errors"
    }
  }

  render() {
    return (
    <div className="address-tier-calculator">
      <div className="address-field-wrapper">
        <Form>
          <FormGroup 
            controlId="address"
            validationState={this.state.addressValidationState} >
            <ControlLabel>Your street address</ControlLabel>
            <FormControl
              type="text"
              value={this.state.address ? this.state.address : " " }
              onChange={this.handleAddressChange}
            />
            <FormControl.Feedback/>
          </FormGroup>
        </Form>
        { this.state.addressValidationState &&
            this.state.addressValidationState !== "success" &&
            <div className="address-status-message">
              {this.displayStatusMessage(this.state.addressValidationState)}
            </div>
        }
      </div>
      <div className="tier-display-wrapper">
        <FormGroup
          controlId="tier"
          validationState={this.state.addressValidationState}>
          <ControlLabel>Your CPS Tier</ControlLabel>
          <TierDisplay
            inProgress={this.state.requestInProgress}
            value={this.state.tier ? this.state.tier : " "}/>
        </FormGroup>
      </div>
    </div>
    )
  }
}
