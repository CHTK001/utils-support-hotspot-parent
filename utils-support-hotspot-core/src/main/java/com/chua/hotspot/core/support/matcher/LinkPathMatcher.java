package com.chua.hotspot.core.support.matcher;

/**
 * @author CH
 */
public class LinkPathMatcher extends AntPathMatcher {

    @Override
    public boolean match(String pattern, String path) {
        String[] split = pattern.split("[|]");
        if (split.length == 1) {
            return super.match(pattern, path);
        }

        for (String s : split) {
            if (super.match(s.trim(), path)) {
                return true;
            }
        }
        return false;
    }
}
