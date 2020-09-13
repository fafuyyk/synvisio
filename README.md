# SynVisio
SynVisio is an interactive multiscale visualization tool that lets you explore the results of McScanX a popular synteny and collinearity detection toolkit and DAGChainer (similar tool).

SynVisio is available for free to use at [https://synvisio.github.io](https://synvisio.github.io).

### SynVisio requires two files to run:
- The simplified gff file that was used as an input for a McScanX query.
- The collinearity file generated as an output by McScanX for the same input query.

SynVisio can be directly plugged into a webpage by loading the JS file and
initializing it. You need to provide the id of the container into which SynVisio will be
rendered. You also need to provide the input files in the form of a collinearity file, gff file and additional tracks files if needed. 
