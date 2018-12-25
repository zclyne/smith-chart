# smith-chart

Smith chart application for impedance matching.

Static page powered by foundation.js and paper.js, originated in [cemulate/smith-chart](https://github.com/cemulate/smith-chart) 

Served at https://faymek.github.io/smith-chart .

## Requirements

You need a simple http server. If your IDE have the support, for example PyCharm (Alt + F2), you have no bother to run smith-chart.py.

You can also run `python -m http.server`, and the page is served at `http://localhost:8000/` by default.

`Depreciated` If you use Flask, you may need to create a virtual python environment, because Flask is not compatible with the latest scientific computing packages. Required packages are listed in requirements.txt, but some packages are not essential.


## Process

1. 基本完成pi2型
2. 因为在 Complex.js 中没有复数除法，所以在 index.html 的 head 部分加了复数的除法函数，具体参见
3. 阻抗换算按钮不做了😄

## TODO 
- 在f=5的时候会有报错
- 元件承压值
