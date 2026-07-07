package com.chua.hotspot.mybatis.support.plugin;

import com.chua.hotspot.core.support.log.LogFactory;
import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.builder.xml.XMLMapperEntityResolver;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ResultMap;
import org.apache.ibatis.parsing.XNode;
import org.apache.ibatis.parsing.XPathParser;
import org.apache.ibatis.session.Configuration;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.chua.hotspot.core.support.utils.ReflectionHelper.getFieldValue;


/**
 * @author CH
 */
public class MybatisFactory {

    static final LogFactory log = LogFactory.getInstance();

    static final MybatisFactory INSTANCE = new MybatisFactory();
    Set<String> resources = new HashSet<>();
    private Configuration configuration;

    public static MybatisFactory getInstance() {
        return INSTANCE;
    }

    public void register(Configuration configuration) {
        this.configuration = configuration;
    }

    public void register(String resource) {
        if (resource.startsWith("file")) {
            resources.add(resource.substring(resource.indexOf("[") + 1, resource.length() - 1).replace("\\", "/"));
            return;
        }
        resources.add(resource);
    }

    public void rebaseXml(File file) {
        if (!resources.contains(file.getAbsolutePath().replace("\\", "/"))) {
            return;
        }

        reload(file);
    }

    @SuppressWarnings("ALL")
    private void reload(File file) {
        try {
            Configuration targetConfiguration = configuration;
            Class<?> tClass = targetConfiguration.getClass();
            Class<?> aClass = Configuration.class;

            Set<String> loadedResources = (Set<String>) getFieldValue(targetConfiguration, aClass, "loadedResources");
            loadedResources.clear();

            Map<String, ResultMap> resultMaps = (Map<String, ResultMap>) getFieldValue(targetConfiguration, tClass, "resultMaps");
            Map<String, XNode> sqlFragmentsMaps = (Map<String, XNode>) getFieldValue(targetConfiguration, tClass, "sqlFragments");
            Map<String, MappedStatement> mappedStatementMaps = (Map<String, MappedStatement>) getFieldValue(targetConfiguration, tClass, "mappedStatements");

            XPathParser parser;
            try (FileInputStream fis = new FileInputStream(file)) {
                parser = new XPathParser(fis, true, targetConfiguration.getVariables(), new XMLMapperEntityResolver());
            }
            XNode mapperXnode = parser.evalNode("/mapper");
            List<XNode> resultMapNodes = mapperXnode.evalNodes("/mapper/resultMap");
            String namespace = mapperXnode.getStringAttribute("namespace");
            for (XNode xNode : resultMapNodes) {
                String id = xNode.getStringAttribute("id", xNode.getValueBasedIdentifier());
                resultMaps.remove(namespace + "." + id);
            }

            List<XNode> sqlNodes = mapperXnode.evalNodes("/mapper/sql");
            for (XNode sqlNode : sqlNodes) {
                String id = sqlNode.getStringAttribute("id", sqlNode.getValueBasedIdentifier());
                sqlFragmentsMaps.remove(namespace + "." + id);
            }

            List<XNode> msNodes = mapperXnode.evalNodes("select|insert|update|delete");
            for (XNode msNode : msNodes) {
                String id = msNode.getStringAttribute("id", msNode.getValueBasedIdentifier());
                mappedStatementMaps.remove(namespace + "." + id);
            }
            try (FileInputStream fileInputStream = new FileInputStream(file)) {
                XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(fileInputStream,
                        targetConfiguration, file.getAbsolutePath(), targetConfiguration.getSqlFragments());
                xmlMapperBuilder.parse();
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
            log.info("mapperLocation reload success: '{}'", file);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
