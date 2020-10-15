const React = require("react");

exports.getComponents = function ({
  title = "Sugar Bowl Blues News",
  summary,
  subtitle,
  address,
  sender,
  email,
}) {
  return {
    wrapper: (props) => {
      return (
        <mjml>
          <mj-head>
            <mj-title>{title}</mj-title>
            {!!summary && <mj-preview>{summary}</mj-preview>}
            <mj-attributes>
              <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
              <mj-text
                font-weight="400"
                font-size="16px"
                color="#000000"
                line-height="24px"
                font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
              ></mj-text>
            </mj-attributes>
            <mj-style inline="inline">
              {".text-link { color: #3182ce }"}
            </mj-style>
            <mj-style inline="inline">
              {".footer-link { color: #888888 }"}
            </mj-style>
          </mj-head>
          <mj-body background-color="#111133">
            <mj-section
              background-url="http://perthblues.dance/static/1c8d60d8b47c69c0d0af40a45907494c/c0b28/email-header-2020-10.jpg"
              vertical-align="middle"
              background-size="cover"
              full-width="full-width"
              background-repeat="no-repeat"
            >
              <mj-column width="100%" vertical-align="middle">
                <mj-text
                  align="right"
                  font-size="16px"
                  color="#ffffff"
                  padding-bottom="30px"
                  padding-top="25px"
                >
                  <span style="font-size:30px;line-height:30px">{title}</span>
                  <br />
                  <br />
                  {subtitle}
                </mj-text>
              </mj-column>
            </mj-section>
            {props.children}
            <mj-section full-width="full-width">
              <mj-column width="100%" vertical-align="middle">
                <mj-text align="center" font-size="11px" color="#aaaaaa">
                  {sender && (
                    <p style={{ fontSize: "11px" }}>
                      <span style={{ color: "red" }}>&hearts;</span> {sender}
                    </p>
                  )}
                  {email && (
                    <p style={{ fontSize: "11px" }}>
                      To unsubscribe, just reply to <b>{email}</b>
                    </p>
                  )}
                  {address && (
                    <p style={{ fontSize: "11px" }}>
                      Our mailing address is {address}
                    </p>
                  )}
                </mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      );
    },
    section: ({ children }) => (
      <mj-section
        background-color="#ffffff"
        vertical-align="top"
        full-width="full-width"
      >
        <mj-column>{children}</mj-column>
      </mj-section>
    ),
    h1: ({ children }) => (
      <mj-text padding-bottom="0">
        <span style={{ fontSize: "20px", color: "#3182ce" }}>{children}</span>
      </mj-text>
    ),
    h2: ({ children }) => (
      <mj-text padding-bottom="0">
        <span style={{ fontSize: "16px", color: "#3182ce" }}>{children}</span>
      </mj-text>
    ),
    p: ({ children }) => <mj-text>{children}</mj-text>,
    ul: ({ children }) => (
      <mj-text padding-bottom="0">
        <ul>{children}</ul>
      </mj-text>
    ),
  };
};
