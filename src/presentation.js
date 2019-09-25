// Import React
import React from "react";

// Import Spectacle Core tags
import {
  BlockQuote,
  Cite,
  CodePane,
  Deck,
  Heading,
  ListItem,
  List,
  Quote,
  Slide,
  Text
} from "spectacle";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Require CSS
import styles from "./styles.module.css";
require("normalize.css");

const theme = createTheme(
  {
    primary: "white",
    secondary: "#1F2022",
    tertiary: "#03A9FC",
    quaternary: "#CECECE"
  },
  {
    primary: "Montserrat",
    secondary: "Helvetica"
  }
);

const loopShader = `
  uniform mediump sampler2D user_input;
  mediump ivec2 user_inputSize = ivec2(35, 36);
  mediump ivec3 user_inputDim = ivec3(5000, 1, 1);
  out vec4 data0;
  float kernelResult;

  void kernel() {
    float user_accumulator=0.0;

    for (int user_i=1;(user_i<=5000);user_i++){
      user_accumulator
        += div_with_int_check(
          getMemoryOptimized32(user_input, user_inputSize, user_inputDim, 0, 0, threadId.x)+1.0,
          float(user_i)
        );
    }

    kernelResult = user_accumulator;
    return;
  }

  void main(void) {
    index = int(vTexCoord.s * float(uTexSize.x)) + int(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;
    threadId = indexTo3D(index, uOutputDim);
    kernel();
    data0[0] = kernelResult;

  }
`;

const kernelCode = `
  void kernel() {
    float user_accumulator=0.0;
    
    for (int user_i=1; user_i<=5000; user_i++) {
      user_accumulator
        += div_with_int_check(
          getMemoryOptimized32(
            user_input,
            user_inputSize,
            user_inputDim,
            0,
            0,
            threadId.x
          ) +1.0,
          float(user_i)
        );
    }

    kernelResult = user_accumulator;
    return;
  }
`;

const run = `
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
`;

const readTexture = `
  readFloatPixelsToFloat32Array() {
    const texSize = this.texSize,
          gl = this.context;
    const w = texSize[0];
    const h = texSize[1];
    const result = new Float32Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, result);
    return result;
  }
`;

const jsLoop = `
  for(let i=1; i<=5000; i++) {
    let accumulator = 0;
    for (let j = 1; j<=5000; j++) {
      accumulator += j / i;
    }
    output[i] = accumulator;
  }
`;

const gpuLoop = `
  // Run this 5000x
  gpuMultiply(input: Number[]) {
    let accumulator = 0;
    for (let i = 1; i <= 5000; i++) {
      accumulator += (input[this.thread.x] + 1) / i;
    }
    return accumulator;
  };
`;

const CodeTemplate = ({ title, src }) => (
  <Slide>
    <Heading size={1} fit caps lineHeight={1} textColor="secondary">
      {title}
    </Heading>
    <CodePane className={styles.code} lang="js" source={src} />
  </Slide>
);

const TitlePage = () => (
  <Slide transition={["zoom"]} bgColor="primary">
    <Heading size={1} fit caps lineHeight={1} textColor="secondary">
      Unlocking the supercomputer in your browser
    </Heading>
    <Text margin="10px 0 0" textColor="tertiary" size={1} fit bold>
      General-purpose GPU computing with GPU.js
    </Text>
  </Slide>
);

const Demo = () => (
  <Slide>
    <iframe
      className={styles.demo}
      title="demo"
      src="https://lukeolney.me/javascript-gpgpu-demo/"
    ></iframe>
  </Slide>
);

const ShaderToy = ({ title, src }) => (
  <Slide>
    <Heading size={1} fit caps lineHeight={1} textColor="secondary">
      {title}
    </Heading>
    <iframe
      preload={true}
      width="640"
      height="360"
      frameborder="0"
      src={src}
      title={title}
      allowfullscreen
    ></iframe>
  </Slide>
);

const Applications = () => (
  <Slide>
    <Heading size={1} fit caps lineHeight={1} textColor="secondary">
      Applications
    </Heading>
    <List>
      <ListItem>TensorFlow.js? uses their own backend</ListItem>
      <ListItem>
        OpenCV? has a JS version, but compiled used emscripten
      </ListItem>
    </List>
  </Slide>
);

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck
        transition={["zoom", "slide"]}
        transitionDuration={500}
        progress="bar"
        theme={theme}
      >
        <TitlePage />
        <CodeTemplate title="Some code" src={jsLoop} />
        <Demo />
        <ShaderToy
          title="How's it done?"
          src="https://www.shadertoy.com/embed/ld2Gz3?gui=true&t=10&paused=true&muted=false"
        />
        <ShaderToy src="https://www.shadertoy.com/embed/XsX3RB?gui=true&t=10&paused=true&muted=false" />
        <Slide>
          <Heading size={1} fit caps lineHeight={1} textColor="secondary">
            Pipeline
          </Heading>
          Compile shader -> load data as texture -> draw -> read texture as data
        </Slide>
        <CodeTemplate title="Compiled shader" src={kernelCode} />
        <CodeTemplate title="Draw" src={run} />
        <CodeTemplate title="Read texture as data" src={readTexture} />
        <Applications />
      </Deck>
    );
  }
}
