let ReportUtil = {
	ReportContentSql(type=null,langStatus){
		var sql = 
        `SELECT type,page,ifnull(d.LANGCONTENT,c.CONTENT) as content,tid,icon,did,txdat
        FROM
          (
          SELECT a.CLASS3 AS type,b.CLASS3 AS page,a.OID AS tid,a.CLASS5 AS icon,b.oid AS did,b.CONTENT,b.LEN AS len,b.txdat
          FROM  THF_MASTERDATA A,THF_MASTERDATA B 
          WHERE B.CLASS4 =  A.OID AND A.STATUS='Y' AND B.STATUS='Y' AND B.CLASS1='Report' 
        `;
		if(type){
			sql =sql+` AND A.CLASS3='${type}' `;
		}
		sql =sql+` )C LEFT JOIN 
          (select LANGID,LANGCONTENT from THF_LANGUAGE where LANGTYPE='${langStatus}' and STATUS='Y') D 
        on C.did=D.LANGID  order by txdat`;

    	return sql;
	}
}

export default ReportUtil;

