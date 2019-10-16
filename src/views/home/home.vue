<template>
    <div class="detail-case">
        <div class="title-name">{{titlename}}案件列表</div>
        <div class="tip-line">
            <div>
                统计日期：{{startmonth}}至{{endmonth}}
            </div>
            <div style="position: relative">
                <el-button type="primary" size="small" @click="exportCurrentPage()">导出当前页</el-button>
                <el-button type="primary" size="small" @click="exportAll()">导出全部</el-button>
            </div>
        </div>
        <el-table id="out-table" :data="tableData" border stripe highlight-current-row
                  v-loading="loading"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.6)">
            <el-table-column prop="baah" label="案号"></el-table-column>
            <el-table-column prop="jbfy" label="经办法院"></el-table-column>
            <el-table-column prop="cbbmbs" label="承办庭室"></el-table-column>
            <el-table-column prop="cbr" label="承办人" width="85"></el-table-column>
            <el-table-column prop="saly" label="收案来源" width="125"></el-table-column>
            <el-table-column prop="larq" label="立案日期" :formatter="larqFormatter" width="100"></el-table-column>
            <el-table-column prop="laay" label="案由"></el-table-column>
            <el-table-column prop="jarq" label="结案日期" :formatter="jarqFormatter" width="100"></el-table-column>
            <el-table-column prop="jafs" label="结案方式"></el-table-column>
        </el-table>
        <div class="page-line">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentpage"
                    :page-sizes="[20, 30, 40, 50]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script> 
import $ from 'jquery';
export default {
    data() {
        return {
            tableData: [],
            tableAllData: [],
            startmonth: '',
            endmonth: '',
            titlename: '',
            currentpage: 1,
            showcount: 20,
            total: 0,
            loading: true
        };
    },
    mounted() {
        var params = {
                zt: '新收',
                aydm: '',
                case_title: '行政',
                fyjb: '',
                sfqb: '',
                spcx: '',
                qtcs: '',
                cbbmbs: ''
            };
        this.getCaseList(params);
    },
    methods: {
        async getCaseList(params) {
            this.loading = true;
            let res = await this.jbxxlist(params);
            if (res.code === 1) {
                this.loading = false;
                this.tableAllData = res.data;
                this.tableData = this.tableAllData.slice(0, 20);
                this.total = res.data.length;
            } else {
                this.loading = false;
            }
        },
        jbxxlist(option) {
            let _self = this;
            $.ajax({
                    type: "post",
                    url: "http://chart-center/jxcc/jbxxlist",
                    async: true,
                    datatype: "json",
                    data: option,
                    success: function(res) {
                        _self.loading = false;
                        if (res.code === 1) {
                            _self.tableAllData = res.data;
                            _self.tableData = _self.tableAllData.slice(0, 20);
                            _self.total = res.data.length;
                        }
                    }

                }); 
        },
        larqFormatter(row) {
            if (row.larq) {
               return row.larq.substring(0, 10);
            } else {
                return '';
            }
        },
        jarqFormatter(row) {
            if (row.jarq) {
               return row.jarq.substring(0, 10);
            } else {
                return '';
            }
        },
        handleSizeChange(val) {
            this.loading = true;
            if (this.tableAllData.length) {
                this.showcount = val;
                this.tableData = this.tableAllData.slice(0, val);
                this.loading = false;
            }
        },
        handleCurrentChange(val) {
            if (this.tableAllData.length) {
                this.currentpage = val;
                if (val === 1) {
                    this.tableData = this.tableAllData.slice(0, Number(this.showcount));
                } else {
                    this.tableData = this.tableAllData.slice((val - 1) * Number(this.showcount), val *
                        Number(this.showcount) - 1);
                }
            }
        },
        exportCurrentPage() {
            this.excelTable(this.tableData);  //把data里的tableData存到list
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]));
        },
        exportAll() {
            this.excelTable(this.tableAllData);
        },
        excelTable(TableData) {
           require.ensure([], () => {
                const { export_json_to_excel } = require('./excel/Export2Excel');
                const tHeader = ['案号', '经办法院', '承办庭室', '承办人', '收案来源', '立案日期', '案由', '结案日期', '结案方式'];  // 设置Excel的表格第一行的标题
                const title = ['', '', '', '', '', '', '', '', ''];
                const filterVal = ['baah', 'jbfy', 'cbbmbs', 'cbr', 'saly', 'larq', 'laay', 'jarq', 'jafs'];  // index、nickName、name是tableData里对象的属性
                const list = TableData;  //把data里的tableData存到list
                const data = this.formatJson(filterVal, list);
                data.map(item => {
                    item.map((i, index) => {
                        if (!i) {
                            item[index] = ''
                        }
                    });
                });
                const merges = ['A1:I1']; //合并单元格
                export_json_to_excel({
                    title: title,
                    header: tHeader,
                    data,
                    merges,
                    filename: this.titlename + '案件',
                    autoWidth: true,
                    bookType: 'xlsx'
                });
            }); 
        }
    }
};
</script>
<style lang="scss" scoped>
    .detail-case {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        .title-name {
            width: 100%;
            text-align: center;
            padding: 15px 0 10px;
            font-size: 20px;
            font-weight: bold;
        }
        .tip-line {
            width: 94%;
            margin: 0 auto;
            padding-bottom: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .comeback-btn {
            position: absolute;
            top: -38px;
            right: 0;
        }
        .page-line {
            width: 94%;
            padding-top: 6px;
            margin: 0 auto;
        }
    }
    /deep/
    .el-table {
        width: 94%;
        margin: 0 auto;
    }
    /deep/
    .el-table__header {
        color: rgb(96, 98, 102);
        background: rgb(245, 247, 250);
    }
</style>
