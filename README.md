# smith-chart

Smith chart application for impedance matching.

Static page powered by foundation.js and paper.js, originated in [cemulate/smith-chart](https://github.com/cemulate/smith-chart) 

Served at https://faymek.github.io/smith-chart .

## Requirements

You need a simple http server. If your IDE have the support, for example PyCharm (Alt + F2), you have no bother to run smith-chart.py.

You can also run `python -m http.server`, and the page is served at `http://localhost:8000/` by default.

`Depreciated` If you use Flask, you may need to create a virtual python environment, because Flask is not compatible with the latest scientific computing packages. Required packages are listed in requirements.txt, but some packages are not essential.


## Process

2018-12-31 已提交0.6beta
完成圆图、L1，L2，T1，pi1，pi2型匹配电路大部分设计

## TODO 
- 计算原件承压值，在圆图显示
- 修复数值误差
