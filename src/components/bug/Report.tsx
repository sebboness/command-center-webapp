import * as asana from "asana";
import * as moment from "moment";
import * as React from "react";
import * as BS from "reactstrap";
import { connect } from "react-redux";
import * as redux from "redux";
import * as Comp from "../../components";
import * as Forms from "../../forms";
import Settings from "../../settings";
import { AppState } from "../../store";
import { ReactHelper, Utility } from "../../utils";
import { ComponentWithValidatedForm } from "../validation";

const mapStateToProps = (state: AppState, ownProps: OwnProps | undefined): ConnectedState => ({
    ...Comp.Base.DefaultStatePropsMap(state, ownProps),
});

const mapDispatchToProps = (dispatch: redux.Dispatch<AppState>): ConnectedDispatch => ({
    ...Comp.Base.DefaultDispatchPropsMap(dispatch),
});

interface OwnProps {
    linkText: string;
}

type ConnectedState = Comp.Base.DefaultConnectedState & {
};

type ConnectedDispatch = Comp.Base.DefaultConnectedDispatch & {
};

interface OwnState {
    errors: string[];
    show: boolean;
}

type CombinedProps = ConnectedState & ConnectedDispatch & OwnProps;

class ReportComponent extends ComponentWithValidatedForm<CombinedProps, OwnState> {

    public constructor(props: any) {
        super(props);
        const formModel = new Forms.Bug.Report();
        this.state = {
            ...this.getInitialState(formModel),
            errors: [],
            show: false,
        };
    }

    public async componentDidMount() {
        this._isMounted = true;
        // uncomment to query asana users
        // const client = asana.Client.create().useAccessToken(Settings.AsanaAccessToken);
        // const users = await client.users.findAll({ workspace: 325520744758 });
        // console.log(users);
    }

    public componentWillUnmount() {
        this._isMounted = false;
    }

    public render() {
        return <>
            <a href="#" onClick={(e) => { ReactHelper.emptyClick(e); this.setState({ ...this.state, show: true }); }}>{this.props.linkText}</a>

            <Comp.Modal.ModalForm
                formComponent={this}
                onCancel={() => this.setState({ ...this.state, show: false })}
                processing={this.state.formProcessing}
                open={this.state.show}
                title={"SHARE FEEDBACK"}
            >
                <p>
                    Please provide a brief description
                    of the feedback or issue and <strong>include your email address</strong> so
                    that we may follow up. Thank you for notifying us.
                </p>

                {this.state.errors.length
                    ? <BS.Alert color="danger">
                        <h3>Unable to submit bug report</h3>
                        <ul>
                            {this.state.errors.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                    </BS.Alert>
                    : null}

                <Comp.Validation.ValidatedForm
                    formComponent={this}
                    model={this.state.formModel.data}
                    onValidSubmit={(model) => this.handleSubmit(model)}
                    schema={this.state.formModel.rules}
                    ref={(ref: any) => this.form = ref}
                >
                    <Comp.Editors.TextAreaField formComponent={this} name="description" compact label="" />

                </Comp.Validation.ValidatedForm>
            </Comp.Modal.ModalForm>
        </>;
    }

    private async handleSubmit(model: Forms.Bug.ReportData) {
        this.setState({ errors: [] }, async () => {
            this.toggleProcessing(true);

            try {
                const client = asana.Client.create().useAccessToken(Settings.AsanaAccessToken);
                const guid = Utility.guid();

                const notes = `----------------------`
                    + `\r\nFeedback:`
                    + `\r\n----------------------`
                    + `\r\nReference guid: ${guid}`
                    + `\r\nClient site: ${window.location.hostname}`
                    + `\r\nSubmitted on: ${moment.utc().format("M/D/YYYY HH:mm")} GMT`
                    + `\r\nSubmitted from: ${window.location.href}`
                    + `\r\n`
                    + `\r\n----------------------`
                    + `\r\nDescription from user:`
                    + `\r\n----------------------`
                    + `\r\n${model.description}`
                    + `\r\n`

                const task = await client.tasks.create({
                    assignee: "0", 
                    memberships: [{
                        project: "0", // 
                        section: "0", // 
                    }],
                    name: `Feedback - ${window.location.hostname} [${guid}]`,
                    notes,
                    workspace: "", // 
                } as any);

                if (!this._isMounted)
                    return;

                if (task.id)
                    this.props.notifySuccess("Thank you for reporting a bug");

                const formModel = new Forms.Bug.Report();
                this.updateFormModelData(formModel.data, () => {
                    this.setState({ ...this.state, formProcessing: false, show: false });
                });
            }
            catch (err) {
                const msg = typeof err === "object"
                    ? JSON.stringify(err)
                    : err.toString();
                this.setState({ ...this.state, formProcessing: false, errors: [msg] });
            }
        });
    }
}

export const Report: React.ComponentClass<OwnProps> = connect(mapStateToProps, mapDispatchToProps)(ReportComponent);
