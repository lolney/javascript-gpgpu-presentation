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
  mediump ivec2 user_inputSize = ivec2(1, 1);
  mediump ivec3 user_inputDim = ivec3(1, 1, 1);
  out vec4 data0;
  float kernelResult;
  
  /* The compiled Javascript function */
  void kernel() { 
    for (int user_i=0;(user_i<100000000);user_i++){
      (user_i*10);
    }

    kernelResult = 0.0;return;
  }

  void main(void) {
    index = int(vTexCoord.s * float(uTexSize.x)) + int(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;
    threadId = indexTo3D(index, uOutputDim);
    kernel();
    data0[0] = kernelResult;
  }
`;

const nonLoopShader = `
uniform mediump sampler2D user_input;
mediump ivec2 user_inputSize = ivec2(2500, 2500);
mediump ivec3 user_inputDim = ivec3(25000000, 1, 1);
out vec4 data0;
float kernelResult;

/* The compiled Javascript function */
void kernel() {
  kernelResult = (
    10.0* getMemoryOptimized32(user_input, user_inputSize, user_inputDim, 0, 0, threadId.x)
  );
  return;
}

void main(void) {
  index = int(vTexCoord.s * float(uTexSize.x)) + int(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;
  threadId = indexTo3D(index, uOutputDim);
  kernel();
  data0[0] = kernelResult;

}`;

const kernelCode = `
void kernel() {
  kernelResult = (
    10.0* getMemoryOptimized32(user_input, user_inputSize, user_inputDim, 0, 0, threadId.x)
  );
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

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck
        transition={["zoom", "slide"]}
        transitionDuration={500}
        theme={theme}
      >
        <Slide transition={["zoom"]} bgColor="primary">
          <Heading size={1} fit caps lineHeight={1} textColor="secondary">
            Unlocking the supercomputer in your browser
          </Heading>
          <Text margin="10px 0 0" textColor="tertiary" size={1} fit bold>
            General-purpose GPU computing with GPU.js
          </Text>
        </Slide>
        <Slide>
          <iframe
            className={styles.demo}
            title="demo"
            src="https://lukeolney.me/javascript-gpgpu-demo/"
          ></iframe>
        </Slide>
        <Slide>
          <iframe
            width="640"
            height="360"
            frameborder="0"
            src="https://www.shadertoy.com/embed/ld2Gz3?gui=true&t=10&paused=true&muted=false"
            title="shader-raytracer"
            allowfullscreen
          ></iframe>
        </Slide>
        <Slide>
          <iframe
            width="640"
            height="360"
            frameborder="0"
            src="https://www.shadertoy.com/embed/XsX3RB?gui=true&t=10&paused=true&muted=false"
            title="shader-procedural-generation"
            allowfullscreen
          ></iframe>
        </Slide>
        <Slide>
          <CodePane className={styles.code} source={nonLoopShader} />
        </Slide>
        <Slide>
          <CodePane className={styles.code} source={kernelCode} />
        </Slide>
        <Slide>
          <CodePane className={styles.code} source={run} />
        </Slide>
        <Slide>
          <CodePane className={styles.code} source={readTexture} />
        </Slide>
        <Slide transition={["fade"]} bgColor="tertiary">
          <Heading size={6} textColor="primary" caps>
            Typography
          </Heading>
          <Heading size={1} textColor="secondary">
            Heading 1
          </Heading>
          <Heading size={2} textColor="secondary">
            Heading 2
          </Heading>
          <Heading size={3} textColor="secondary">
            Heading 3
          </Heading>
          <Heading size={4} textColor="secondary">
            Heading 4
          </Heading>
          <Heading size={5} textColor="secondary">
            Heading 5
          </Heading>
          <Text size={6} textColor="secondary">
            Standard text
          </Text>
        </Slide>
        <Slide transition={["fade"]} bgColor="primary" textColor="tertiary">
          <Heading size={6} textColor="secondary" caps>
            Standard List
          </Heading>
          <List>
            <ListItem>Item 1</ListItem>
            <ListItem>Item 2</ListItem>
            <ListItem>Item 3</ListItem>
            <ListItem>Item 4</ListItem>
          </List>
        </Slide>
        <Slide transition={["fade"]} bgColor="secondary" textColor="primary">
          <BlockQuote>
            <Quote>Example Quote</Quote>
            <Cite>Author</Cite>
          </BlockQuote>
        </Slide>
      </Deck>
    );
  }
}
