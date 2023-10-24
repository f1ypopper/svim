FROM alpine:latest as build

ARG DOWNLOAD_FILENAME=redbean-original-2.0.8.com

RUN apk add --update zip bash
RUN wget https://redbean.dev/${DOWNLOAD_FILENAME} -O redbean.com
RUN chmod +x redbean.com

# normalize the binary to ELF
RUN sh /redbean.com --assimilate

# Add your files here
COPY src /src
WORKDIR /src
RUN zip -r /redbean.com *

# just for debugging purposes
RUN ls -la /redbean.com
RUN zip -sf /redbean.com


FROM scratch

COPY --from=build /redbean.com /
CMD ["/redbean.com", "-vv", "-p", "80"]