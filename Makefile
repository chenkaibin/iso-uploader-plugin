project_name = iso-uploader-plugin
version = $(shell grep "%define _version" $(project_name).spec  | awk '{print $$3}')

sources:
	git archive --format=tar --prefix=$(project_name)-$(version)/ HEAD | gzip -9v > $(project_name)-$(version).tar.gz
rpm:
	$(shell mkdir -p ~/rpmbuild/SOURCES)
	$(shell mv $(project_name)-$(version).tar.gz ~/rpmbuild/SOURCES)
	rpmbuild -ba $(project_name).spec
