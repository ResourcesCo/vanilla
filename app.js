import { h, Component, render } from 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';

const html = htm.bind(h);

function SwitchBorderImage() {
  return html`<svg width="100%" height="100%" viewBox="0 0 60 35">
    <linearGradient id="linearColors1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#999"></stop>
      <stop offset="25%" stop-color="#ccc"></stop>
      <stop offset="75%" stop-color="#ccc"></stop>
      <stop offset="100%" stop-color="#999"></stop>
    </linearGradient>
    <path d="m 17.5 0 a 17.5 17.5 0 0 0 0 35 l 25 0 a 17.5 17.5 0 0 0 0 -35 l -25 0"
        fill="none" stroke="url(#linearColors1)" stroke-width="10" />
  </svg>`
}

function Switch({checked, onClick}) {
  return html`<div class="switch-box">
    <${SwitchBorderImage}/>
    <div class="switch-border">
      <div class=${`switch ${checked ? 'checked' : ''}`} onClick=${onClick}>
        <div class="knob"></div>
      </div>
    </div>
  </div>`
}

class SwitchControl extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.onChange(!this.props.checked);
  }

  render({checked}) {
    return html`<div class="switch-pane"><${Switch} onClick=${this.toggle} checked=${checked} /></div>`
  }
}

class SwitchLayout extends Component {
  constructor(props) {
    super(props);
    this.state = { showDataPane: false };
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
  }

  handleSwitchChange(checked) {
    this.setState({showDataPane: checked});
  }

  render() {
    return html`<div class="switch-layout full-height">
      <div class="main-pane">
        <div class="tree-pane"></div>
        <div class="data-pane"></div>
      </div>
      <${SwitchControl} checked=${this.state.showDataPane} onChange=${this.handleSwitchChange} />
    </div>`
  }
}

function SplitLayout() {
  return html`<div class="split-layout">
    <div class="tree"></div>
    <div class="data"></div>
  </div>`
}

// https://github.com/Faisal-Manzer/postcss-viewport-height-correction
class ViewportHeightFix extends Component {
  constructor(props) {
    super(props);
    this.state = { clientHeight: null };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    const newClientHeight = document.documentElement.clientHeight;
    if (newClientHeight !== this.state.clientHeight) {
      this.setState({clientHeight: newClientHeight});
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--vh', (newClientHeight * 0.01) + 'px');
      });
    }
  }

  render({children}) {
    return children;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.handleMatchMediaChange = this.handleMatchMediaChange.bind(this);
  }

  componentDidMount() {
    this.mql = window.matchMedia("(min-width: 640px)");
    this.setState({splitView: this.mql.matches});
    this.mql.addListener(this.handleMatchMediaChange);
  }

  componentWillUnmount() {
    this.mql.removeListener(this.handleMatchMediaChange);
  }

  handleMatchMediaChange(e) {
    this.setState({splitView: e.matches});
  }

  render({}, {splitView}) {
    return html`<${ViewportHeightFix}>
      ${splitView ? html`<${SplitLayout}/>` : html`<${SwitchLayout}/>`}
    </${ViewportHeightFix}>`
  }
}

function init() {
  render(html`<${App}/>`, document.body);
}

init();