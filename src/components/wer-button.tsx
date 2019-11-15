import * as React from "react";

import styled from "styled-components";

const BaseButton = ({ children, callback, disabled }) => (
    <a className="button" onClick={disabled ? (event) => event.preventDefault() : callback} >
      {children}
    </a>
 );

const StyledButton = styled(BaseButton)`
  border: 1px solid #000;
  background: gray;
  margin: 5px;
  padding: 5px;
`;  

export interface WerButtondProps { caption: string, callback?: CallableFunction, disabled: boolean};

interface WerButtonState { caption: string, disabled: boolean};

export class WerButton extends React.Component<WerButtondProps, {}> {
    
    public state: WerButtonState;
    private _isMounted: boolean;

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            caption: this.props.caption,
            disabled: this.props.disabled,
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.onClick.bind(this);
    }
    
    componentWillUnmount() {
        this._isMounted = false;
     }

    onClick = async () => {
            this._isMounted && this.setState({disabled: true, caption: 'Processing'});
            const res = await this.props.callback()
            this._isMounted && this.setState({disabled: this.props.disabled, caption: this.props.caption});
            return res;
    }
    
    public static defaultProps = {
        caption: "Delete",
        callback: () => {},
        disabled: false,
    };

    public render(): JSX.Element {
        return (
            <StyledButton callback= {this.onClick} disabled={this.state.disabled}>
                { this.state.caption }
            </StyledButton>
        )
    }
}