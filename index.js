const babel = require("@babel/core");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const mdx = require("@mdx-js/mdx");
const { MDXProvider, mdx: createElement } = require("@mdx-js/react");
const { createCompiler } = require("@mdx-js/mdx");
const detectFrontmatter = require("remark-frontmatter");
const sectionize = require("./src/remark-sectionize-alt");
const vfile = require("vfile");
const visit = require("unist-util-visit");
const remove = require("unist-util-remove");
const yaml = require("yaml");
const path = require("path");
const fs = require("fs");
const open = require("open");
const temp = require("temp").track();
const mjml2html = require("mjml");
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");
aws.config.region = "ap-southeast-2";

const { getComponents } = require("import-jsx")("./src/template");

(async function () {
  const mdx = fs.readFileSync(path.resolve("content/example.md"), {
    encoding: "utf-8",
  });
  const config = yaml.parse(
    fs.readFileSync(path.resolve("content/config.yaml"), {
      encoding: "utf-8",
    })
  );

  const mjml = await renderWithReact(vfile(mdx), config);
  // console.log(html);
  // await writeTempAndOpen(mdx, { suffix: ".md" }, ["sublime text"]);

  const html = mjml2html(mjml).html;
  // console.log(html);
  await writeTempAndOpen(html, { suffix: ".html" }, ["brave browser"]);

  const transporter = nodemailer.createTransport({
    SES: new aws.SES({ apiVersion: "2010-12-01" }),
  });

  // Requires SES roles.
  // {
  //   "Statement": [
  //       {
  //           "Effect": "Allow",
  //           "Action": "ses:SendRawEmail",
  //           "Resource": "*"
  //       }
  //   ]
  // }
  transporter.sendMail(
    {
      from: "career@roycetownsend.com",
      to: "test@roycetownsend.com",
      subject: "Test Message",
      html: html,
      text: mdx,
    },
    (err, info) => {
      if (err) {
        console.log(err);
      }
      if (info) {
        console.log(info.envelope);
        console.log(info.messageId);
      }
    }
  );
})();

function extractFrontmatter() {
  return function transformer(tree, file) {
    visit(tree, "yaml", function visitor(node) {
      file.data.frontmatter = yaml.parse(node.value);
    });
    remove(tree, "yaml");
  };
}

const transform = (code) =>
  babel.transform(code, {
    plugins: [
      "@babel/plugin-transform-react-jsx",
      "@babel/plugin-proposal-object-rest-spread",
    ],
  }).code;

async function renderWithReact(file, config) {
  const mdxCompiler = createCompiler({
    skipExport: true,
    remarkPlugins: [detectFrontmatter, extractFrontmatter, sectionize],
  });

  const { contents, data } = await mdxCompiler.process(file);

  const jsx = `/* @jsx mdx */
  ${contents}`;

  const code = transform(jsx);
  const scope = { mdx: createElement };
  const fn = new Function(
    "React",
    ...Object.keys(scope),
    `${code}; return React.createElement(MDXContent)`
  );
  const element = fn(React, ...Object.values(scope));
  const components = getComponents({ ...config, ...data.frontmatter });
  const elementWithProvider = React.createElement(
    MDXProvider,
    { components },
    element
  );
  return renderToStaticMarkup(elementWithProvider);
}

async function writeTempAndOpen(data, affixes, app) {
  const info = temp.openSync(affixes);
  fs.writeSync(info.fd, data);
  fs.closeSync(info.fd);

  await open(`file://${info.path}`, {
    wait: true,
    app,
  });
}
